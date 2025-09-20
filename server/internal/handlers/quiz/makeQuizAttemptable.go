package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var MakeQuizAttemptable = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	attachment := models.Attachment{}
	quizID := c.Params("id")

	quiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	if quiz.CanBeAttempted {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz is already attemptable!")
	}

	// TODO: To ensure the quiz, has at least a question
	// and each question has an at least two answers
	quiz.CanBeAttempted = true

	updatedQuiz, err := quiz.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	savedAttachments, err := attachment.FindAllByQuiz(quizID, 20, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	for _, savedAttachment := range savedAttachments {
		updatedQuiz.Attachments = append(updatedQuiz.Attachments, &savedAttachment)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz made attemptable successfully!",
		"data":    updatedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
