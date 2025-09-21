package answer

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetAnswer = func(c *fiber.Ctx) error {
	answer := models.Answer{}
	answerID := c.Params("id")

	savedAnswer, err := answer.FindOneAndIncludeAttachments(answerID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedAnswer.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}

	response := fiber.Map{
		"status": "success",
		"data":   savedAnswer,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
