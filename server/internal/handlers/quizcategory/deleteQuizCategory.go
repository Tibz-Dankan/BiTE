package quizcategory

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var DeleteQuizCategory = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}
	quizID := c.Params("id")

	savedQuiz, err := quizCategory.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Quiz category of provided ID doesn't exist!")
	}

	err = quizCategory.Delete(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Category deleted successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
