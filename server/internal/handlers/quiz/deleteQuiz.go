package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

// To be improved
var DeleteQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	quizID := c.Params("id")

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Quiz of provided ID doesn't exist!")
	}

	err = quiz.Delete(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz deleted successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
