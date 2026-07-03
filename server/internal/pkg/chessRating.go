package pkg

import (
	"math"

	"github.com/Tibz-Dankan/glicko2"
)

// ChessRatingInput carries the pre-game rating state for both the user and the
// puzzle, plus the game outcome, into the Glicko-2 computation.
//
// Win is from the USER's perspective: true when the user solved the puzzle
// (cleanly). DaysSinceUserLastGame is the real elapsed time since the user's
// previous rated attempt (0 for a brand-new player); it drives the Lichess
// fractional rating-period RD decay.
type ChessRatingInput struct {
	UserRating       int
	UserRD           int
	UserVolatility   float64
	PuzzleRating     int
	PuzzleRD         int
	PuzzleVolatility float64
	Win              bool

	DaysSinceUserLastGame float64
}

// ChessRatingResult carries the post-game rating state for both parties.
// UserRatingDiff is the integer delta (after - before) for a "+N" / "-N" UI.
type ChessRatingResult struct {
	UserRating       int
	UserRD           int
	UserVolatility   float64
	PuzzleRating     int
	PuzzleRD         int
	PuzzleVolatility float64
	UserRatingDiff   int
}

// ComputeChessRating runs one Glicko-2 game between the user and the puzzle and
// returns the updated ratings for both. It is a thin, dependency-isolating
// wrapper around github.com/Tibz-Dankan/glicko2 so handlers never import the
// rating library directly. DB values are stored as ints (rating/RD) and are
// rounded on the way back out; Volatility is preserved as a float64.
func ComputeChessRating(in ChessRatingInput) ChessRatingResult {
	player := glicko2.Rating{
		Rating:     float64(in.UserRating),
		Deviation:  float64(in.UserRD),
		Volatility: in.UserVolatility,
	}
	puzzle := glicko2.Rating{
		Rating:     float64(in.PuzzleRating),
		Deviation:  float64(in.PuzzleRD),
		Volatility: in.PuzzleVolatility,
	}

	newPlayer, newPuzzle := glicko2.ComputeGame(player, puzzle, in.Win, in.DaysSinceUserLastGame)

	return ChessRatingResult{
		UserRating:       int(math.Round(newPlayer.Rating)),
		UserRD:           int(math.Round(newPlayer.Deviation)),
		UserVolatility:   newPlayer.Volatility,
		PuzzleRating:     int(math.Round(newPuzzle.Rating)),
		PuzzleRD:         int(math.Round(newPuzzle.Deviation)),
		PuzzleVolatility: newPuzzle.Volatility,
		UserRatingDiff:   glicko2.RatingDiff(player, newPlayer),
	}
}
