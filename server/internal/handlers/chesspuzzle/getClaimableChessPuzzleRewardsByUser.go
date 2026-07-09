package chesspuzzle

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetClaimableChessPuzzleRewardsByUser = func(c *fiber.Ctx) error {
	satsRewardChessPuzzle := models.SatsRewardChessPuzzle{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")
	userID := c.Params("userID")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if userID != c.Locals("userID").(string) {
		return fiber.NewError(fiber.StatusForbidden, "Invalid userID provided!")
	}

	claimableRounds, pagination, err := satsRewardChessPuzzle.FindAllSatsClaimForUser(
		limit,
		cursorParam,
		userID,
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":     "success",
		"message":    "Chess puzzles to be rewarded with sats fetched successfully!",
		"data":       claimableRounds,
		"pagination": pagination,
	})
}
