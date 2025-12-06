package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetQuizDataForAttempt = func(c *fiber.Ctx) error {
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

	if !savedQuiz.CanBeAttempted {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz is not attemptable!")
	}

	if questionCursor == "" {
		lastAttempt, err := attempt.FindLastAttemptByQuizAndUser(quizID, userID)
		if err != nil && err.Error() != constants.RECORD_NOT_FOUND_ERROR {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		if lastAttempt.ID != "" {
			questionCursor = lastAttempt.QuestionID
		} else {
			questionCursor = ""
		}
	}

	questions, err := question.FindAllByQuizForAttempt(quizID, limit+1, questionCursor)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(questions) > int(limit) {
		questions = questions[:len(questions)-1] // Remove last element
		nextCursor = questions[len(questions)-1].ID
		hasNextItems = true
	}

	pagination := map[string]interface{}{
		"limit":        limit,
		"nextCursor":   nextCursor,
		"hasNextItems": hasNextItems,
		"count":        len(questions),
	}

	for _, question := range questions {
		savedQuiz.Questions = append(savedQuiz.Questions, &question)
	}

	response := fiber.Map{
		"status":     "success",
		"message":    "Quiz fetched successfully!",
		"data":       savedQuiz,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
