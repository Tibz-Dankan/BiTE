package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var HideQuestionAIPreview = func(c *fiber.Ctx) error {
	question := models.Question{}
	questionID := c.Params("id")

	question, err := question.FindOne(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if question.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}

	updatedQuestion, err := question.UpdateShowAIPreview(questionID, false)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Question AI preview status updated to false successfully!",
		"data":    updatedQuestion,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
