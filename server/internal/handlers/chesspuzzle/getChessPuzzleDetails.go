package chesspuzzle

import (
	"strings"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// GetChessPuzzleDetails is an admin-only endpoint that returns the full
// stored record for a single chess puzzle, including its raw and parsed
// move list (i.e. the solution). Unlike GetNextChessPuzzle, the solution
// is intentionally included here since this is an admin-only view.
var GetChessPuzzleDetails = func(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Chess Puzzle ID is required!")
	}

	chessPuzzle := models.ChessPuzzle{}
	puzzle, err := chessPuzzle.FindOne(id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if puzzle.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Chess Puzzle not found!")
	}

	moves := strings.Fields(puzzle.Moves)

	response := map[string]interface{}{
		"status":  "success",
		"message": "Chess puzzle details fetched successfully!",
		"data": map[string]interface{}{
			"id":              puzzle.ID,
			"fen":             puzzle.FEN,
			"moves":           moves,
			"movesRaw":        puzzle.Moves,
			"plyCount":        len(moves),
			"rating":          puzzle.Rating,
			"ratingDeviation": puzzle.RatingDeviation,
			"volatility":      puzzle.Volatility,
			"popularity":      puzzle.Popularity,
			"nbPlays":         puzzle.NbPlays,
			"themes":          puzzle.Themes,
			"gameUrl":         puzzle.GameUrl,
			"openingTags":     puzzle.OpeningTags,
			"color":           puzzle.Color,
			"createdAt":       puzzle.CreatedAt,
			"updatedAt":       puzzle.UpdatedAt,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
