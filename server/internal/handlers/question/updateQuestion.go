package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type UpdateQuestionInput struct {
	Title                     string `json:"title"`
	TitleDelta                string `json:"titleDelta"`
	TitleHTML                 string `json:"titleHTML"`
	Introduction              string `json:"introduction"`
	IntroductionDelta         string `json:"introductionDelta"`
	IntroductionHTML          string `json:"IntroductionHTML"`
	PostedByUserID            string `json:"postedByUserID"`
	QuizID                    string `json:"quizID"`
	SequenceNumber            int64  `json:"sequenceNumber"`
	HasMultipleCorrectAnswers bool   `json:"hasMultipleCorrectAnswers"`
	RequiresNumericalAnswer   bool   `json:"requiresNumericalAnswer"`
}

var UpdateQuestion = func(c *fiber.Ctx) error {
	question := models.Question{}
	answer := models.Answer{}
	attachment := models.Attachment{}
	updateQuestionInput := UpdateQuestionInput{}
	questionID := c.Params("id")

	if err := c.BodyParser(&updateQuestionInput); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if updateQuestionInput.PostedByUserID == "" ||
		updateQuestionInput.QuizID == "" ||
		updateQuestionInput.Title == "" ||
		updateQuestionInput.SequenceNumber == 0 {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing postedByUserID/Title/QuizID/SequenceNumber!")
	}

	savedQuestion, err := question.FindOne(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuestion.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}

	// Capture original SequenceNumber before overwriting it
	originalSequenceNumber := savedQuestion.SequenceNumber

	savedQuestion.Title = updateQuestionInput.Title
	savedQuestion.TitleDelta = updateQuestionInput.TitleDelta
	savedQuestion.TitleHTML = updateQuestionInput.TitleHTML
	savedQuestion.Introduction = updateQuestionInput.Introduction
	savedQuestion.IntroductionDelta = updateQuestionInput.IntroductionDelta
	savedQuestion.IntroductionHTML = updateQuestionInput.IntroductionHTML
	savedQuestion.SequenceNumber = updateQuestionInput.SequenceNumber
	savedQuestion.HasMultipleCorrectAnswers = updateQuestionInput.HasMultipleCorrectAnswers
	savedQuestion.RequiresNumericalAnswer = updateQuestionInput.RequiresNumericalAnswer

	if !savedQuestion.IsDeltaDefault {
		savedQuestion.IsDeltaDefault = true
	}

	if updateQuestionInput.RequiresNumericalAnswer {
		savedQuestion.HasMultipleCorrectAnswers = false
	}

	totalQuestions, err := question.GetTotalCountByQuiz(savedQuestion.QuizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Validation: Check if sequence number is valid
	// Note: totalQuestions includes the current question being updated
	if updateQuestionInput.SequenceNumber < 1 || updateQuestionInput.SequenceNumber > totalQuestions {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Sequence Number!")
	}

	if originalSequenceNumber != updateQuestionInput.SequenceNumber {
		if updateQuestionInput.SequenceNumber < originalSequenceNumber {
			// Moving Up (e.g., 5 -> 3): Shift items in [new, old) UP (+1)
			if err := question.ShiftSequencesUp(savedQuestion.QuizID, updateQuestionInput.SequenceNumber, originalSequenceNumber); err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}
		} else {
			// Moving Down (e.g., 2 -> 4): Shift items in (old, new] DOWN (-1)
			if err := question.ShiftSequencesDown(savedQuestion.QuizID, originalSequenceNumber, updateQuestionInput.SequenceNumber); err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}
		}
	}

	updatedQuestion, err := savedQuestion.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	savedAttachments, err := attachment.FindAllByQuestion(questionID, 20, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	for _, savedAttachment := range savedAttachments {
		updatedQuestion.Attachments = append(updatedQuestion.Attachments, &savedAttachment)
	}

	savedAnswers, err := answer.FindAllByQuestion(questionID, 20, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	for _, savedAnswer := range savedAnswers {
		updatedQuestion.Answers = append(updatedQuestion.Answers, &savedAnswer)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Question updated successfully!",
		"data":    updatedQuestion,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
