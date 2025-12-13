package answer

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetNextAnswerSequenceNumber = func(c *fiber.Ctx) error {
	answer := models.Answer{}

	questionID := c.Query("questionID")

	if questionID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing questionID query parameter!")
	}

	question := models.Question{}
	question, err := question.FindOne(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if question.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}

	nextSequenceNumber, err := answer.GetNextSequenceNumber(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Next answer sequence number fetched successfully!",
		"data": fiber.Map{
			"nextSequenceNumber": nextSequenceNumber,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
