package quizcategory

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllQuizCategories = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allQuizCategories, err := quizCategory.FindAll(limit+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(allQuizCategories) > int(limit) {
		allQuizCategories = allQuizCategories[:len(allQuizCategories)-1] // Remove last element
		nextCursor = allQuizCategories[len(allQuizCategories)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(allQuizCategories),
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allQuizCategories,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
