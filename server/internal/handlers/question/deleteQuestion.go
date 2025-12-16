package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var DeleteQuestion = func(c *fiber.Ctx) error {
	question := models.Question{}
	questionID := c.Params("id")

	savedQuestion, err := question.FindOne(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuestion.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Question of provided ID doesn't exist!")
	}

	err = question.Delete(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Rearrange Sequence Numbers
	// Shift all questions with sequence > deletedSequence DOWN by 1
	// Using a large number as the upper bound for simplicity and efficiency
	if err := question.ShiftSequencesDown(savedQuestion.QuizID, savedQuestion.SequenceNumber, 1000000); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Question deleted successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
