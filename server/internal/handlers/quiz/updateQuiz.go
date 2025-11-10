package quiz

import (
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

type UpdateQuizInput struct {
	Title             string `json:"title"`
	TitleDelta        string `json:"titleDelta"`
	TitleHTML         string `json:"titleHTML"`
	Introduction      string `json:"introduction"`
	IntroductionDelta string `json:"introductionDelta"`
	IntroductionHTML  string `json:"introductionHTML"`
	PostedByUserID    string `json:"postedByUserID"`
	StartsAt          string `json:"startsAt"`
	EndsAt            string `json:"endsAt"`
	Instructions      string `json:"instructions"`
	InstructionsDelta string `json:"instructionsDelta"`
	InstructionsHTML  string `json:"instructionsHTML"`
}

var UpdateQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	attachment := models.Attachment{}
	updateQuizInput := UpdateQuizInput{}
	user := models.User{}
	quizID := c.Params("id")

	if err := c.BodyParser(&updateQuizInput); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if updateQuizInput.PostedByUserID == "" ||
		updateQuizInput.Title == "" ||
		updateQuizInput.StartsAt == "" ||
		updateQuizInput.EndsAt == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing postedByUserID/Title/startsAt/endsAt!")
	}

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	user, err = user.FindOne(updateQuizInput.PostedByUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if user.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User of provided ID doesn't exist!")
	}

	parsedStartsAt, err := time.Parse(time.RFC3339, updateQuizInput.StartsAt)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid startsAt format! Must be an ISO 8601 string.")
	}

	parsedEndsAt, err := time.Parse(time.RFC3339, updateQuizInput.EndsAt)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid endsAt format! Must be an ISO 8601 string.")
	}

	// now := time.Now()

	if parsedEndsAt.Before(parsedStartsAt) || parsedEndsAt.Equal(parsedStartsAt) {
		return fiber.NewError(fiber.StatusBadRequest,
			"endsAt can't be less or equal to startsAt!")
	}

	// if parsedStartsAt.Before(now) || parsedEndsAt.Before(now) {
	// 	return fiber.NewError(fiber.StatusBadRequest,
	// 		"Provided startsAt/endsAt can't be less than current time!")
	// }

	savedQuiz.Title = updateQuizInput.Title
	savedQuiz.TitleDelta = updateQuizInput.TitleDelta
	savedQuiz.TitleHTML = updateQuizInput.TitleHTML
	savedQuiz.Introduction = updateQuizInput.Introduction
	savedQuiz.IntroductionDelta = updateQuizInput.IntroductionDelta
	savedQuiz.IntroductionHTML = updateQuizInput.IntroductionHTML
	savedQuiz.EndsAt = parsedEndsAt
	savedQuiz.StartsAt = parsedStartsAt
	savedQuiz.Instructions = updateQuizInput.Instructions
	savedQuiz.InstructionsDelta = updateQuizInput.InstructionsDelta
	savedQuiz.InstructionsHTML = updateQuizInput.InstructionsHTML

	if !savedQuiz.IsDeltaDefault {
		savedQuiz.IsDeltaDefault = true
	}

	updatedQuiz, err := savedQuiz.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	savedAttachments, err := attachment.FindAllByQuiz(quizID, 20, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	for _, savedAttachment := range savedAttachments {
		updatedQuiz.Attachments = append(updatedQuiz.Attachments, &savedAttachment)
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz updated successfully!",
		"data":    updatedQuiz,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
