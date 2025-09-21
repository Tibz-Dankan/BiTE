package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetQuestion = func(c *fiber.Ctx) error {
	question := models.Question{}
	questionID := c.Params("id")

	savedQuestion, err := question.FindOneAndIncludeAttachments(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuestion.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}

	response := fiber.Map{
		"status": "success",
		"data":   savedQuestion,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
