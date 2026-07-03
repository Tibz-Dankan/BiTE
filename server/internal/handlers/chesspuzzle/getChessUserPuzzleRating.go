package chesspuzzle

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// GetChessUserPuzzleRating returns the authenticated user's puzzle rating,
// creating it at the default values on first request.
var GetChessUserPuzzleRating = func(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	userRating := models.ChessUserPuzzleRating{}
	rating, err := userRating.FindOrCreateByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Chess user puzzle rating fetched successfully!",
		"data": map[string]interface{}{
			"rating":          rating.Rating,
			"ratingDeviation": rating.RatingDeviation,
			"volatility":      rating.Volatility,
			"gamesPlayed":     rating.GamesPlayed,
			"provisional":     rating.RatingDeviation > 110,
			"lastPlayedAt":    rating.LastPlayedAt,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
