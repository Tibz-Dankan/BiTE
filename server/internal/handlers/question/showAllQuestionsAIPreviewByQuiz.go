package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var ShowAllQuestionsAIPreviewByQuiz = func(c *fiber.Ctx) error {
	question := models.Question{}
	quiz := models.Quiz{}
	quizID := c.Params("quizID")

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	updatedQuestions, err := question.UpdateShowAIPreviewByQuiz(quizID, true)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "All questions AI preview status updated to true successfully!",
		"data":    updatedQuestions,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
