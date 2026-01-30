package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetQuizUserProgressCount = func(c *fiber.Ctx) error {
	quizUserProgress := models.QuizUserProgress{}
	userID := c.Params("userID")

	if userID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "UserID is required!")
	}

	quizInProgressCount, err := quizUserProgress.GetTotalCountByStatusAndUser(userID, "IN_PROGRESS")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	quizCompletedCount, err := quizUserProgress.GetTotalCountByStatusAndUser(userID, "COMPLETED")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	quizUnattemptedCount, err := quizUserProgress.GetTotalCountOfUnattemptedQuizzesByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	responseData := fiber.Map{
		"inProgressCount":  quizInProgressCount,
		"completedCount":   quizCompletedCount,
		"unattemptedCount": quizUnattemptedCount,
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz user progress count fetched successfully!",
		"data":    responseData,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
