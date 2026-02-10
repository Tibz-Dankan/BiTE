package satsreward

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetSatsRewardAddressesByUser = func(c *fiber.Ctx) error {
	satsRewardAddress := models.SatsRewardAddress{}
	userID := c.Params("userID")
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	satsRewardAddresses, err := satsRewardAddress.FindAllByUser(userID, limit+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(satsRewardAddresses) > int(limit) {
		satsRewardAddresses = satsRewardAddresses[:len(satsRewardAddresses)-1] // Remove last element
		nextCursor = satsRewardAddresses[len(satsRewardAddresses)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(satsRewardAddresses),
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":     "success",
		"message":    "Sats reward addresses fetched successfully!",
		"data":       satsRewardAddresses,
		"pagination": pagination,
	})
}
