package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	question := models.Question{}
	quizID := c.Params("id")

	savedQuiz, err := quiz.FindOneAndIncludeAttachments(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	questions, err := question.FindAllByQuiz(quizID, 25, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	for _, question := range questions {
		savedQuiz.Questions = append(savedQuiz.Questions, &question)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Attachment Updated successfully!",
		"data":    savedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
