package analytics

import (
	"math"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetUserAnalytics = func(c *fiber.Ctx) error {
	user := models.User{}
	attempt := models.Attempt{}
	attemptDuration := models.AttemptDuration{}
	attemptStatus := models.AttemptStatus{}
	ranking := models.Ranking{}

	userID := c.Locals("userID").(string)

	_, err := user.FindOne(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "User not found")
	}

	totalQuizzesAttempted, err := attempt.GetTotalQuizzesAttemptedByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	totalDuration, err := attemptDuration.GetTotalDurationByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	totalAttempts, err := attempt.CountDistinctQuestionsByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	userRanking, err := ranking.FindByUser(userID)
	if err != nil {
		// Log error but don't fail, maybe they just don't have a rank yet
		// or return 0 for rank
	}

	avgCorrectScore, err := attemptStatus.GetAverageCorrectScoreByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var avgAttemptDuration float64
	if totalQuizzesAttempted > 0 {
		avgAttemptDuration = float64(totalDuration) / float64(totalQuizzesAttempted)
	}

	// Round to 2 decimal places
	avgCorrectScore = math.Round(avgCorrectScore*100) / 100
	avgAttemptDuration = math.Round(avgAttemptDuration)

	analytics := fiber.Map{
		"totalQuizzesAttempted":   totalQuizzesAttempted,
		"totalAttemptDuration":    totalDuration,
		"totalQuestionsAttempted": totalAttempts, // Total questions attempted (distinct)
		"rank":                    userRanking.Rank,
		"averageCorrectScore":     avgCorrectScore,
		"averageAttemptDuration":  avgAttemptDuration,
	}

	response := fiber.Map{
		"status":  "success",
		"message": "User analytics fetched successfully!",
		"data":    analytics,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
