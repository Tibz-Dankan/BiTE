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

	savedAnswer.Title = updateQuestionInput.Title
	savedAnswer.TitleDelta = updateQuestionInput.TitleDelta
	savedAnswer.TitleHTML = updateQuestionInput.TitleHTML
	savedAnswer.SequenceNumber = updateQuestionInput.SequenceNumber
	savedAnswer.IsCorrect = updateQuestionInput.IsCorrect

	if !savedAnswer.IsDeltaDefault {
		savedAnswer.IsDeltaDefault = true
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
