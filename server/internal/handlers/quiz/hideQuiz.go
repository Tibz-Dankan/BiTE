package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var HideQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	attempt := models.Attempt{}
	quizID := c.Params("id")

	quiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	quizAttempt, err := attempt.FindOneByQuiz(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quizAttempt.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Can't hide quiz that has already been attempted!")
	}

	updatedQuiz, err := quiz.UpdateShowQuiz(quizID, false)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz show status updated to false successfully!",
		"data":    updatedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
