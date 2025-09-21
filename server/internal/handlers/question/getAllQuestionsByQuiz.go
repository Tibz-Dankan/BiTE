package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllQuestionsByQuiz = func(c *fiber.Ctx) error {
	question := models.Question{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")
	quizID := c.Params("quizID")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allQuestions, err := question.FindAllByQuiz(quizID, limit, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var prevCursor string
	if len(allQuestions) > 0 {
		prevCursor = allQuestions[len(allQuestions)-1].ID
	}

	pagination := map[string]interface{}{
		"limit":      limit,
		"prevCursor": prevCursor,
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allQuestions,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
