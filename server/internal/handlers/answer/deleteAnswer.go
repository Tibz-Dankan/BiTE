package answer

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var DeleteAnswer = func(c *fiber.Ctx) error {
	answer := models.Answer{}
	answerID := c.Params("id")

	savedAnswer, err := answer.FindOne(answerID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedAnswer.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Answer of provided ID doesn't exist!")
	}

	err = answer.Delete(answerID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Answer deleted successfully!",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
