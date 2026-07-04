package chesspuzzle

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetChessPuzzleSatsRewardsByUser = func(c *fiber.Ctx) error {
	satsRewardChessPuzzle := models.SatsRewardChessPuzzle{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")
	userID := c.Params("userID")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	satsRewards, err := satsRewardChessPuzzle.FindAllByUser(userID, limit+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(satsRewards) > int(limit) {
		satsRewards = satsRewards[:len(satsRewards)-1] // Remove last element
		nextCursor = satsRewards[len(satsRewards)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(satsRewards),
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":     "success",
		"message":    "Chess puzzle sats rewards fetched successfully!",
		"data":       satsRewards,
		"pagination": pagination,
	})
}
