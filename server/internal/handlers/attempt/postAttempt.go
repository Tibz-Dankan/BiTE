package attempt

import (
	"encoding/json"
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

type PostAttemptInput struct {
	UserID       string `json:"userID"`
	QuestionID   string `json:"questionID"`
	AnswerIDList string `json:"answerIDList"`
	AnswerInput  string `json:"answerInput"`
}

var PostAttempt = func(c *fiber.Ctx) error {
	attempt := models.Attempt{}
	postAttemptInput := PostAttemptInput{}
	question := models.Question{}

	if err := c.BodyParser(&postAttemptInput); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	attempt.UserID = postAttemptInput.UserID
	attempt.QuestionID = postAttemptInput.QuestionID
	attempt.AnswerInput = postAttemptInput.AnswerInput

	log.Printf("attempt: %+v", attempt)

	if attempt.UserID == "" ||
		// attempt.QuizID == "" || // To be reported to fibre core team
		attempt.QuestionID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			// "Missing UserID/QuizID/QuestionID/AnswerID!")
			"Missing UserID/QuestionID!")
	}

	var attempts []models.Attempt
	var answerIDList []string

	if postAttemptInput.AnswerIDList == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing AnswerIDList!")
	}

	err := json.Unmarshal([]byte(postAttemptInput.AnswerIDList), &answerIDList)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid answerIDList format! Must be a JSON stringified array of strings.")
	}

	if len(answerIDList) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Please provide an answer!")
	}

	if len(answerIDList) > 0 {
		for _, answerID := range answerIDList {
			savedAttempt, err := attempt.FindOneByQuestionAnswerAndUser(attempt.QuestionID,
				answerID, attempt.UserID)
			if err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}
			if savedAttempt.ID != "" {
				return fiber.NewError(fiber.StatusBadRequest, "You have already attempted this question!")
			}
		}
	}

	savedQuestion, err := question.FindOne(attempt.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedQuestion.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}
	if savedQuestion.RequiresNumericalAnswer && attempt.AnswerInput == "" {
		return fiber.NewError(fiber.StatusBadRequest, "This question requires a numerical answer!")
	}
	attempt.QuizID = savedQuestion.QuizID

	// Save all answerIDs of the attempt
	if len(answerIDList) > 0 {
		for _, answerID := range answerIDList {
			attempts = append(attempts,
				models.Attempt{QuizID: attempt.QuizID, QuestionID: attempt.QuestionID,
					AnswerID: answerID, AnswerInput: attempt.AnswerInput, UserID: attempt.UserID})
		}
		attempts, err = attempt.CreateMany(attempts)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	// Publish an event to create attempt status
	attemptStatusEventData := types.AttemptStatusEventData{
		UserID:     attempt.UserID,
		QuestionID: attempt.QuestionID,
	}
	events.EB.Publish("CREATE_ATTEMPT_STATUS", attemptStatusEventData)

	// Publish an event to updare quiz user progress
	quizUserProgressEventData := types.QuizUserProgressEventData{
		UserID: attempt.UserID,
		QuizID: attempt.QuizID,
	}
	events.EB.Publish("UPDATE_QUIZ_USER_PROGRESS", quizUserProgressEventData)

	response := map[string]interface{}{
		"status":  "success",
		"message": "Attempt created successfully!",
		"data":    attempts,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
