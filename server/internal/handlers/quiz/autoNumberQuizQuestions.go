package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// AutoNumberQuizQuestions reorders all questions for a specific quiz
var AutoNumberQuizQuestions = func(c *fiber.Ctx) error {
	question := models.Question{}
	quizID := c.Params("id")

	if quizID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing quiz ID!")
	}

	if err := question.AutoCorrectSequenceNumbers(quizID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Questions reordered successfully!",
		"data":    fiber.Map{},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
