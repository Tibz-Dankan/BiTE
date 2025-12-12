package quiz

import (
	"fmt"
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var MakeQuizAttemptable = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	quizID := c.Params("id")

	quiz, err := quiz.FindOneWithQuestionsAndAnswers(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if quiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	if quiz.CanBeAttempted {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz is already attemptable!")
	}

	if len(quiz.Questions) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz must have at least one question!")
	}

	for _, question := range quiz.Questions {
		if len(question.Answers) == 0 {
			errMessage := fmt.Sprintf("Question '%s' must have at least one answer!", question.Title)
			return fiber.NewError(fiber.StatusBadRequest, errMessage)
		}

		var correctAnswerFound bool
		for _, answer := range question.Answers {
			log.Printf("answer: %+v", answer)
			if answer.IsCorrect {
				correctAnswerFound = true
				break
			}
		}
		if !correctAnswerFound {
			errMessage := fmt.Sprintf("Question '%s' must have at least one correct answer!", question.Title)
			return fiber.NewError(fiber.StatusBadRequest, errMessage)
		}
	}

	now := time.Now()
	if quiz.EndsAt.Before(now) {
		return fiber.NewError(fiber.StatusBadRequest,
			"Quiz can't be attemptable if it has already ended!")
	}

	updatedQuiz, err := quiz.UpdateCanBeAttempted(quizID, true)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	updatedQuiz.Attachments = quiz.Attachments

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz made attemptable successfully!",
		"data":    updatedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
