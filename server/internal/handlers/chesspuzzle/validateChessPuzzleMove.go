package chesspuzzle

import (
	"strings"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type ValidateChessPuzzleMoveInput struct {
	PuzzleID string `json:"puzzleId"`
	Ply      int    `json:"ply"`
	UCI      string `json:"uci"`
}

// ValidateChessPuzzleMove gives live per-move feedback while the user solves a
// puzzle. It does NOT score, update ratings, or write to the DB. It reveals
// only the single immediate opponent reply (needed to animate the board),
// never the rest of the solution.
var ValidateChessPuzzleMove = func(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	input := ValidateChessPuzzleMoveInput{}
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if input.PuzzleID == "" || input.UCI == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing puzzleId/uci!")
	}

	chessPuzzle := models.ChessPuzzle{}
	puzzle, err := chessPuzzle.FindOne(input.PuzzleID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if puzzle.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Puzzle not found")
	}

	moves := strings.Fields(puzzle.Moves)

	// Human plies are the odd indices (index 0 is the auto-played setup move).
	if input.Ply <= 0 || input.Ply >= len(moves) || input.Ply%2 == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid ply")
	}

	correct := strings.EqualFold(input.UCI, moves[input.Ply])
	solved := correct && input.Ply == len(moves)-1

	var opponentReply interface{} = nil
	if correct && !solved && input.Ply+1 < len(moves) {
		opponentReply = moves[input.Ply+1]
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Move validated",
		"data": map[string]interface{}{
			"correct":       correct,
			"opponentReply": opponentReply,
			"solved":        solved,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
