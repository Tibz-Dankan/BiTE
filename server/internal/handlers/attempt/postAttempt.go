package attempt

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var PostAttempt = func(c *fiber.Ctx) error {
	attempt := models.Attempt{}
	question := models.Question{}

	if err := c.BodyParser(&attempt); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Printf("attempt: %+v", attempt)

	if attempt.UserID == "" ||
		// attempt.QuizID == "" || // To be reported to fibre core team
		attempt.QuestionID == "" ||
		attempt.AnswerID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			// "Missing UserID/QuizID/QuestionID/AnswerID!")
			"Missing UserID/QuestionID/AnswerID!")
	}

	savedAttempt, err := attempt.FindOneByQuestionAnswerAndUser(attempt.QuestionID,
		attempt.AnswerID, attempt.UserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedAttempt.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "You have already attempted this question!")
	}

	savedQuestion, err := question.FindOne(attempt.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedQuestion.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}
	attempt.QuizID = savedQuestion.QuizID

	newAttempt, err := attempt.Create(attempt)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Printf("newAttempt: %+v", newAttempt)

	response := map[string]interface{}{
		"status":  "success",
		"message": "Attempt created successfully!",
		"data":    newAttempt,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
