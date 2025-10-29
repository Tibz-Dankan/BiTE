package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllQuizzes = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allQuiz, err := quiz.FindAll(limit+1, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(allQuiz) > int(limit) {
		allQuiz = allQuiz[:len(allQuiz)-1] // Remove last element
		nextCursor = allQuiz[len(allQuiz)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(allQuiz),
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allQuiz,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
