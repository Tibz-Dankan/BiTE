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

	allQuiz, err := quiz.FindAll(limit, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var prevCursor string
	if len(allQuiz) > 0 {
		prevCursor = allQuiz[len(allQuiz)-1].ID
	}

	pagination := map[string]interface{}{
		"limit":      limit,
		"prevCursor": prevCursor,
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allQuiz,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
