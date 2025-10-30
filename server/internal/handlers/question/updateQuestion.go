package question

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type UpdateQuestionInput struct {
	Title                     string `json:"title"`
	Introduction              string `json:"introduction"`
	PostedByUserID            string `json:"postedByUserID"`
	QuizID                    string `json:"quizID"`
	SequenceNumber            int64  `json:"sequenceNumber"`
	HasMultipleCorrectAnswers bool   `json:"hasMultipleCorrectAnswers"`
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

	savedQuestion.Title = updateQuestionInput.Title
	savedQuestion.Introduction = updateQuestionInput.Introduction
	savedQuestion.SequenceNumber = updateQuestionInput.SequenceNumber
	savedQuestion.HasMultipleCorrectAnswers = updateQuestionInput.HasMultipleCorrectAnswers

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
