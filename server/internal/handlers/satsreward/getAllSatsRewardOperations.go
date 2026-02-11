package satsreward

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllSatsRewardOperations = func(c *fiber.Ctx) error {
	satsRewardOperation := models.SatsRewardOperation{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	satsRewardOperations, err := satsRewardOperation.FindAll(limit+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(satsRewardOperations) > int(limit) {
		satsRewardOperations = satsRewardOperations[:len(satsRewardOperations)-1] // Remove last element
		nextCursor = satsRewardOperations[len(satsRewardOperations)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(satsRewardOperations),
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":     "success",
		"message":    "Sats reward operations fetched successfully!",
		"data":       satsRewardOperations,
		"pagination": pagination,
	})
}
