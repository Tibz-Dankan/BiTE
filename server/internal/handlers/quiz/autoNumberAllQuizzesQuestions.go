package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// AutoNumberAllQuizzesQuestions reorders questions for all quizzes in the system
var AutoNumberAllQuizzesQuestions = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}

	if err := quiz.AutoCorrectAllQuizzesQuestions(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "All quizzes questions reordered successfully!",
		"data":    fiber.Map{},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
