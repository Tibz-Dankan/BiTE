package quiz

import (
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type UpdateQuizDatesInput struct {
	StartsAt string `json:"startsAt"`
	EndsAt   string `json:"endsAt"`
}

var UpdateQuizDates = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	updateQuizDatesInput := UpdateQuizDatesInput{}
	quizID := c.Params("id")

	if err := c.BodyParser(&updateQuizDatesInput); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if updateQuizDatesInput.StartsAt == "" || updateQuizDatesInput.EndsAt == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing startsAt/endsAt!")
	}

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	parsedStartsAt, err := time.Parse(time.RFC3339, updateQuizDatesInput.StartsAt)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid startsAt format! Must be an ISO 8601 string.")
	}

	parsedEndsAt, err := time.Parse(time.RFC3339, updateQuizDatesInput.EndsAt)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid endsAt format! Must be an ISO 8601 string.")
	}

	if parsedEndsAt.Before(parsedStartsAt) || parsedEndsAt.Equal(parsedStartsAt) {
		return fiber.NewError(fiber.StatusBadRequest,
			"endsAt can't be less or equal to startsAt!")
	}

	updatedQuiz, err := savedQuiz.UpdateDates(quizID, parsedStartsAt, parsedEndsAt)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz dates updated successfully!",
		"data":    updatedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
