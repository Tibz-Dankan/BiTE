package answer

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllAnswersByQuestion = func(c *fiber.Ctx) error {
	answer := models.Answer{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")
	questionID := c.Params("questionID")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	allAnswers, err := answer.FindAllByQuestion(questionID, limit, cursorParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var prevCursor string
	if len(allAnswers) > 0 {
		prevCursor = allAnswers[len(allAnswers)-1].ID
	}

	pagination := map[string]interface{}{
		"limit":      limit,
		"prevCursor": prevCursor,
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allAnswers,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
