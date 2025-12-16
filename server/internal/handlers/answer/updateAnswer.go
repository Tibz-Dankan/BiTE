package answer

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type UpdateAnswerInput struct {
	Title          string `json:"title"`
	TitleDelta     string `json:"titleDelta"`
	TitleHTML      string `json:"titleHTML"`
	PostedByUserID string `json:"postedByUserID"`
	QuestionID     string `json:"questionID"`
	SequenceNumber int64  `json:"sequenceNumber"`
	IsCorrect      bool   `json:"isCorrect"`
}

var UpdateAnswer = func(c *fiber.Ctx) error {
	question := models.Question{}
	answer := models.Answer{}
	attachment := models.Attachment{}
	updateQuestionInput := UpdateAnswerInput{}
	answerID := c.Params("id")

	if err := c.BodyParser(&updateQuestionInput); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if updateQuestionInput.PostedByUserID == "" ||
		updateQuestionInput.QuestionID == "" ||
		updateQuestionInput.Title == "" ||
		updateQuestionInput.SequenceNumber == 0 {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing postedByUserID/Title/QuizID/SequenceNumber!")
	}

	savedAnswer, err := answer.FindOne(answerID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedAnswer.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Answer of provided ID doesn't exist!")
	}

	originalSequenceNumber := savedAnswer.SequenceNumber

	savedAnswer.Title = updateQuestionInput.Title
	savedAnswer.TitleDelta = updateQuestionInput.TitleDelta
	savedAnswer.TitleHTML = updateQuestionInput.TitleHTML
	savedAnswer.SequenceNumber = updateQuestionInput.SequenceNumber
	savedAnswer.IsCorrect = updateQuestionInput.IsCorrect

	if !savedAnswer.IsDeltaDefault {
		savedAnswer.IsDeltaDefault = true
	}

	totalAnswers, err := answer.GetTotalCountByQuestion(savedAnswer.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Validation
	if updateQuestionInput.SequenceNumber < 1 || updateQuestionInput.SequenceNumber > totalAnswers {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Sequence Number!")
	}

	if originalSequenceNumber != updateQuestionInput.SequenceNumber {
		if updateQuestionInput.SequenceNumber < originalSequenceNumber {
			// Moving Up
			if err := answer.ShiftSequencesUp(savedAnswer.QuestionID, updateQuestionInput.SequenceNumber, originalSequenceNumber); err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}
		} else {
			// Moving Down
			if err := answer.ShiftSequencesDown(savedAnswer.QuestionID, originalSequenceNumber, updateQuestionInput.SequenceNumber); err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}
		}
	}

	question, err = question.FindOne(savedAnswer.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if question.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question of provided ID doesn't exist!")
	}

	if !question.HasMultipleCorrectAnswers {
		savedQtnAnswers, err := answer.FindAllByQuestion(savedAnswer.QuestionID, 12, "")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		filteredAnswers := []models.Answer{}
		for _, savedQtnAnswer := range savedQtnAnswers {
			if savedQtnAnswer.ID != answerID {
				filteredAnswers = append(filteredAnswers, savedQtnAnswer)
			}
		}

		for _, savedQtnAnswer := range filteredAnswers {
			if savedQtnAnswer.IsCorrect && savedAnswer.IsCorrect {
				savedQtnAnswer.IsCorrect = false
				_, err := savedQtnAnswer.Update()
				if err != nil {
					return fiber.NewError(fiber.StatusInternalServerError, err.Error())
				}
			}
		}
	}

	updatedAnswer, err := savedAnswer.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	savedAttachments, err := attachment.FindAllByAnswer(answerID, 20, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	for _, savedAttachment := range savedAttachments {
		updatedAnswer.Attachments = append(updatedAnswer.Attachments, &savedAttachment)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Answer updated successfully!",
		"data":    updatedAnswer,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
