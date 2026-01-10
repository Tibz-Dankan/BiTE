package ranking

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

func GetUsersWithRanks(c *fiber.Ctx) error {
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	ranking := models.Ranking{}
	rankings, err := ranking.FindAllWithUserDetails(int(limit)+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch rankings")
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(rankings) > int(limit) {
		rankings = rankings[:len(rankings)-1] // Remove last element
		nextCursor = rankings[len(rankings)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(rankings),
	}

	response := fiber.Map{
		"status":     "success",
		"message":    "Users with ranks fetched successfully",
		"data":       rankings,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
