package chesspuzzle

import (
	"strings"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// difficultyOffset maps a difficulty level to a rating offset applied to the
// user's rating when selecting the next puzzle. band stays fixed.
var difficultyOffset = map[string]int{
	"easiest": -500,
	"easier":  -250,
	"normal":  0,
	"harder":  250,
	"hardest": 500,
}

const puzzleRatingBand = 100

// GetNextChessPuzzle returns the next puzzle for the authenticated user near
// their rating (shifted by difficulty), excluding puzzles they've already won.
// The stored solution is intentionally NOT included in the response.
var GetNextChessPuzzle = func(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	difficulty := strings.ToLower(c.Query("difficulty", "normal"))
	offset, valid := difficultyOffset[difficulty]
	if !valid {
		offset = 0
	}

	userRating := models.ChessUserPuzzleRating{}
	rating, err := userRating.FindOrCreateByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	target := rating.Rating + offset

	chessPuzzle := models.ChessPuzzle{}
	var puzzle models.ChessPuzzle

	// A caller resuming a specific puzzle (e.g. after a page refresh) can ask
	// for it by id. A direct lookup intentionally bypasses the already-won
	// exclusion below — that filter only governs random selection. A
	// stale/invalid id falls through to a normal next-puzzle fetch.
	if puzzleID := c.Query("puzzleId", ""); puzzleID != "" {
		puzzle, err = chessPuzzle.FindOne(puzzleID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	if puzzle.ID == "" {
		puzzle, err = chessPuzzle.GetNextForUser(userID, target, puzzleRatingBand)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}
	if puzzle.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "No puzzles available. You may have solved them all!")
	}

	moves := strings.Fields(puzzle.Moves)
	if len(moves) < 2 {
		return fiber.NewError(fiber.StatusInternalServerError, "Puzzle has an invalid move list")
	}

	solverColor := "white"
	if puzzle.Color == "b" {
		solverColor = "black"
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Next chess puzzle fetched successfully!",
		"data": map[string]interface{}{
			"puzzleId":    puzzle.ID,
			"fen":         puzzle.FEN,
			"setupMove":   moves[0],
			"solverColor": solverColor,
			"plyCount":    len(moves),
			"popularity":  puzzle.Popularity,
			"nbPlays":     puzzle.NbPlays,
			"themes":      puzzle.Themes,
			"gameUrl":     puzzle.GameUrl,
			"userRating": map[string]interface{}{
				"rating":          rating.Rating,
				"ratingDeviation": rating.RatingDeviation,
				"gamesPlayed":     rating.GamesPlayed,
				"provisional":     rating.RatingDeviation > 110,
			},
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
