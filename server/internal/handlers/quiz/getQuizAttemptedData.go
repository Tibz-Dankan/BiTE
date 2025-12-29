package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetQuizAttemptedData = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	question := models.Question{}
	attempt := models.Attempt{}
	quizID := c.Params("id")

	userID, ok := c.Locals("userID").(string)
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "User ID not found!")
	}

	limitParam := c.Query("limit")
	questionCursor := c.Query("questionCursor")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	savedQuiz, err := quiz.FindOneAndIncludeAttachments(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	if questionCursor == "" {
		questionCursor = ""
	}

	questions, err := question.FindAllByQuizForAttemptedData(quizID, userID, limit+1, questionCursor)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(questions) > int(limit) {
		questions = questions[:len(questions)-1]
		nextCursor = questions[len(questions)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(questions),
	}

	for i := range questions {
		savedQuiz.Questions = append(savedQuiz.Questions, &questions[i])
	}

	totalQuestions, totalAttemptedQuestions, status, err := attempt.FindProgressByQuizAndUser(quizID, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	totalCorrectQuestions, err := attempt.GetCorrectQuestionsCount(quizID, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	progress := map[string]interface{}{
		"totalQuestions":          totalQuestions,
		"totalAttemptedQuestions": totalAttemptedQuestions,
		"status":                  status,
	}

	var finalScore int64 = 0
	if totalQuestions > 0 {
		finalScore = (totalCorrectQuestions * 100) / totalQuestions
	}

	score := map[string]interface{}{
		"totalQuestions":          totalQuestions,
		"totalAttemptedQuestions": totalAttemptedQuestions,
		"totalCorrectQuestions":   totalCorrectQuestions,
		"finalScore":              finalScore,
	}

	response := fiber.Map{
		"status":     "success",
		"message":    "Quiz attempted data fetched successfully!",
		"data":       savedQuiz,
		"pagination": pagination,
		"progress":   progress,
		"score":      score,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
