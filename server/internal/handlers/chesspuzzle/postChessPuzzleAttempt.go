package chesspuzzle

import (
	"strings"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

// SATS_PER_CHESS_PUZZLE_WIN is the fixed reward for a first-encounter win.
const SATS_PER_CHESS_PUZZLE_WIN = 40

// WRITEBACK_PUZZLE_RATING controls whether the recomputed puzzle rating is
// written back to chess_puzzles. Disabled in v1: the seeded Lichess ratings are
// converged over huge N; writing them back from a small user base adds noise.
// The before/after values are still recorded on the round for analysis.
const WRITEBACK_PUZZLE_RATING = false

// Round outcomes.
const (
	OUTCOME_ATTEMPTED        = "ATTEMPTED"        // a solve submission (win:true)
	OUTCOME_WATCHED_SOLUTION = "WATCHED_SOLUTION" // the user viewed the solution
)

type PostChessPuzzleAttemptInput struct {
	PuzzleID string   `json:"puzzleId"`
	Win      bool     `json:"win"`
	TimeMs   int      `json:"timeMs"`
	Moves    []string `json:"moves"`
	Mistakes int      `json:"mistakes"`
}

// PostChessPuzzleAttempt is the authoritative endpoint. It re-validates the
// submitted line server-side, updates the user's Glicko-2 rating, records the
// round, and (on a first-encounter win) publishes the sats-reward event.
//
// win/rating semantics:
//   - completed = the submitted line matches the full solution (money-safe,
//     server-verified). Drives the sats reward.
//   - clean = completed with zero wrong moves. Drives the Glicko win: a wrong
//     move is a rating loss even though the 40 sats are still paid.
var PostChessPuzzleAttempt = func(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	input := PostChessPuzzleAttemptInput{}
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if input.PuzzleID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing puzzleId!")
	}

	chessPuzzle := models.ChessPuzzle{}
	puzzle, err := chessPuzzle.FindOne(input.PuzzleID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if puzzle.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Puzzle not found")
	}

	userRating := models.ChessUserPuzzleRating{}
	rating, err := userRating.FindOrCreateByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	chessRound := models.ChessPuzzleRound{}
	isFirstEncounter, err := chessRound.HasAnyRound(userID, puzzle.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	isFirstEncounter = !isFirstEncounter

	solutionMoves := strings.Fields(puzzle.Moves)

	// A "view solution" submission (win:false) never touches the rating and is
	// recorded as WATCHED_SOLUTION. It still forfeits any future reward for this
	// puzzle because a round now exists (HasAnyRound becomes true).
	if !input.Win {
		if err := chessPuzzle.IncrementNbPlays(puzzle.ID); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		if _, err := chessRound.Create(models.ChessPuzzleRound{
			ChessPuzzleID:      puzzle.ID,
			UserID:             userID,
			Angle:              "mix",
			Win:                false,
			Clean:              false,
			Outcome:            OUTCOME_WATCHED_SOLUTION,
			TimeMs:             input.TimeMs,
			SatsEarned:         0,
			PuzzleRatingBefore: puzzle.Rating,
			PuzzleRatingAfter:  puzzle.Rating,
			UserRatingBefore:   rating.Rating,
			UserRatingAfter:    rating.Rating,
		}); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		response := map[string]interface{}{
			"status":  "success",
			"message": "Chess puzzle solution viewed",
			"data": map[string]interface{}{
				"win":        false,
				"clean":      false,
				"outcome":    OUTCOME_WATCHED_SOLUTION,
				"satsEarned": 0,
				"userRating": map[string]interface{}{
					"before":          rating.Rating,
					"after":           rating.Rating,
					"diff":            0,
					"ratingDeviation": rating.RatingDeviation,
					"provisional":     rating.RatingDeviation > 110,
				},
				"puzzleRating": map[string]interface{}{
					"before": puzzle.Rating,
					"after":  puzzle.Rating,
				},
				"solution": solutionMoves,
			},
		}
		return c.Status(fiber.StatusCreated).JSON(response)
	}

	// Solve submission (win:true) — re-validate the submitted line against the
	// stored solution's human plies (odd indices; index 0 is the setup move).
	var expectedHumanMoves []string
	for i := 1; i < len(solutionMoves); i += 2 {
		expectedHumanMoves = append(expectedHumanMoves, solutionMoves[i])
	}

	completed := len(input.Moves) == len(expectedHumanMoves)
	if completed {
		for i := range expectedHumanMoves {
			if !strings.EqualFold(input.Moves[i], expectedHumanMoves[i]) {
				completed = false
				break
			}
		}
	}

	clean := completed && input.Mistakes == 0

	// Glicko-2 update. win = clean (Lichess-style: any mistake is a rating loss).
	days := 0.0
	if rating.LastPlayedAt != nil {
		days = time.Since(*rating.LastPlayedAt).Hours() / 24.0
	}

	result := pkg.ComputeChessRating(pkg.ChessRatingInput{
		UserRating:            rating.Rating,
		UserRD:                rating.RatingDeviation,
		UserVolatility:        rating.Volatility,
		PuzzleRating:          puzzle.Rating,
		PuzzleRD:              puzzle.RatingDeviation,
		PuzzleVolatility:      puzzle.Volatility,
		Win:                   clean,
		DaysSinceUserLastGame: days,
	})

	userRatingBefore := rating.Rating

	// Persist the user's new rating.
	now := time.Now()
	rating.Rating = result.UserRating
	rating.RatingDeviation = result.UserRD
	rating.Volatility = result.UserVolatility
	rating.GamesPlayed = rating.GamesPlayed + 1
	rating.LastPlayedAt = &now
	if _, err := rating.Update(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if err := chessPuzzle.IncrementNbPlays(puzzle.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if WRITEBACK_PUZZLE_RATING {
		if err := chessPuzzle.UpdateRating(puzzle.ID, result.PuzzleRating, result.PuzzleRD, result.PuzzleVolatility); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	satsEarned := 0
	if completed && isFirstEncounter {
		satsEarned = SATS_PER_CHESS_PUZZLE_WIN
	}

	if _, err := chessRound.Create(models.ChessPuzzleRound{
		ChessPuzzleID:      puzzle.ID,
		UserID:             userID,
		Angle:              "mix",
		Win:                completed,
		Clean:              clean,
		Outcome:            OUTCOME_ATTEMPTED,
		TimeMs:             input.TimeMs,
		SatsEarned:         satsEarned,
		PuzzleRatingBefore: puzzle.Rating,
		PuzzleRatingAfter:  result.PuzzleRating,
		UserRatingBefore:   userRatingBefore,
		UserRatingAfter:    result.UserRating,
	}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Award the reward asynchronously on a first-encounter win.
	if completed && isFirstEncounter {
		events.EB.Publish("MAKE_CHESS_PUZZLE_SATS_REWARD_PAYMENT", types.ChessPuzzleSatsRewardEventData{
			UserID:        userID,
			ChessPuzzleID: puzzle.ID,
		})
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Chess puzzle attempt recorded successfully!",
		"data": map[string]interface{}{
			"win":        completed,
			"clean":      clean,
			"outcome":    OUTCOME_ATTEMPTED,
			"satsEarned": satsEarned,
			"userRating": map[string]interface{}{
				"before":          userRatingBefore,
				"after":           result.UserRating,
				"diff":            result.UserRatingDiff,
				"ratingDeviation": result.UserRD,
				"provisional":     result.UserRD > 110,
			},
			"puzzleRating": map[string]interface{}{
				"before": puzzle.Rating,
				"after":  result.PuzzleRating,
			},
			"solution": solutionMoves,
		},
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
