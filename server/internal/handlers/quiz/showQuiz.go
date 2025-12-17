package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var ShowQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	quizID := c.Params("id")

	quiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	updatedQuiz, err := quiz.UpdateShowQuiz(quizID, true)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz show status updated to true successfully!",
		"data":    updatedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
