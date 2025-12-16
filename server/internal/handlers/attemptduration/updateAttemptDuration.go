package attemptduration

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var UpdateAttemptDuration = func(c *fiber.Ctx) error {
	attemptDuration := models.AttemptDuration{}
	attempt := models.Attempt{}
	quiz := models.Quiz{}
	quizID := c.Params("quizID")

	userID, ok := c.Locals("userID").(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "User ID not found!")
	}

	if err := c.BodyParser(&attemptDuration); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	attemptDuration.QuizID = savedQuiz.ID

	if attemptDuration.UserID == "" ||
		attemptDuration.QuizID == "" ||
		attemptDuration.Duration == 0 {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing UserID/QuizID/Duration!")
	}

	savedAttemptDuration, err := attemptDuration.
		FindOneByQuizAndUser(attemptDuration.QuizID, attemptDuration.UserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Add  Quiz Attempt Duration
	if savedAttemptDuration.ID == "" {
		attemptDuration, err = attemptDuration.Create(attemptDuration)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	// Update Quiz Attempt Duration
	if savedAttemptDuration.ID != "" {
		if attemptDuration.Duration < savedAttemptDuration.Duration {
			return fiber.NewError(fiber.StatusBadRequest,
				"Provided attempt Duration can't be less than already saved one")
		}
		savedAttemptDuration.Duration = attemptDuration.Duration

		attemptDuration, err = savedAttemptDuration.Update()
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	log.Printf("Attempt Duration: %+v", attemptDuration)

	totalQuestions, totalAttemptedQuestions, status, err := attempt.FindProgressByQuizAndUser(quizID, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	progress := map[string]interface{}{
		"totalQuestions":          totalQuestions,
		"totalAttemptedQuestions": totalAttemptedQuestions,
		"status":                  status,
	}

	response := map[string]interface{}{
		"status":   "success",
		"message":  "Attempt Duration updated successfully!",
		"data":     attemptDuration,
		"progress": progress,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
