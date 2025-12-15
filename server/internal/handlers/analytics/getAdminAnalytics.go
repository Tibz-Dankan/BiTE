package analytics

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetAdminAnalytics = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	question := models.Question{}
	answer := models.Answer{}
	attemptDuration := models.AttemptDuration{}
	attemptStatus := models.AttemptStatus{}
	attempt := models.Attempt{}
	siteVisit := models.SiteVisit{}
	session := models.Session{}
	user := models.User{}

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

	totalAttemptDuration, err := attemptDuration.GetTotalDuration()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	totalQuizzesAttempted, err := attempt.GetTotalDistinctQuizzesAttempted()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	totalQuestionsAttempted, err := attempt.GetTotalDistinctQuestionsAttempted()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	avgCorrectScore, err := attemptStatus.GetAverageCorrectScore()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	siteVisitCount, err := siteVisit.GetTotalCount()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	sessionCount, err := session.GetTotalCount()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	userCount, err := user.GetTotalCount()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	analytics := fiber.Map{
		"totalQuizzes":            quizCount,
		"totalQuestions":          questionCount,
		"totalAnswers":            answerCount,
		"totalAttemptDuration":    totalAttemptDuration,
		"totalQuizzesAttempted":   totalQuizzesAttempted,
		"totalQuestionsAttempted": totalQuestionsAttempted,
		// "averageCorrectScore":        avgCorrectScore, // Global average score % REMOVED
		"averageCorrectScorePerQuiz": avgCorrectScore, // Assuming global average for now as per plan
		"totalSiteVisits":            siteVisitCount,
		"totalUserSessions":          sessionCount, // Logins/Signups
		"totalUsers":                 userCount,
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Admin analytics fetched successfully!",
		"data":    analytics,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
