package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetQuizAnalytics = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	question := models.Question{}
	answer := models.Answer{}

	quizCount, err := quiz.GetTotalCount()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	questionCount, err := question.GetTotalCount()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	answerCount, err := answer.GetTotalCount()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	count := fiber.Map{
		"quizzes":   quizCount,
		"questions": questionCount,
		"answers":   answerCount,
	}

	data := fiber.Map{
		"count": count,
		// More analytics data can be added here in the future
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz analytics fetched successfully!",
		"data":    data,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
