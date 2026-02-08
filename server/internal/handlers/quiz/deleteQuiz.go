package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var DeleteQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	attempt := models.Attempt{}
	quizID := c.Params("id")

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Quiz of provided ID doesn't exist!")
	}

	quizAttempt, err := attempt.FindOneByQuiz(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quizAttempt.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Can't delete quiz that has already been attempted!")
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
