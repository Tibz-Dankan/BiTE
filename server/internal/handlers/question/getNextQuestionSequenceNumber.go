package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetNextQuestionSequenceNumber = func(c *fiber.Ctx) error {
	question := models.Question{}
	quizID := c.Query("quizID")

	if quizID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing quizID query parameter!")
	}

	quiz := models.Quiz{}
	quiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	nextSequenceNumber, err := question.GetNextSequenceNumber(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Next question sequence number fetched successfully!",
		"data": fiber.Map{
			"nextSequenceNumber": nextSequenceNumber,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
