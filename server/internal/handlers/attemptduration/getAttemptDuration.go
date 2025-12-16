package attemptduration

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetAttemptDuration = func(c *fiber.Ctx) error {
	attemptDurationModel := models.AttemptDuration{}
	attemptModel := models.Attempt{}
	quizID := c.Params("quizID")
	userID := c.Locals("userID").(string)

	if quizID == "" || userID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing quizID or UserID")
	}

	attemptDuration, err := attemptDurationModel.FindOneByQuizAndUser(quizID, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if attemptDuration.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Attempt duration not found!")
	}

	totalQuestions, totalAttemptedQuestions, status, err := attemptModel.FindProgressByQuizAndUser(quizID, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	progress := map[string]interface{}{
		"totalQuestions":          totalQuestions,
		"totalAttemptedQuestions": totalAttemptedQuestions,
		"status":                  status,
	}

	response := map[string]interface{}{
		"status":       "success",
		"message":      "Attempt Duration fetched successfully!",
		"data":         attemptDuration,
		"userProgress": progress,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
