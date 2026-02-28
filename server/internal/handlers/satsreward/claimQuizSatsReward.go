package satsreward

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

var ClaimQuizSatsReward = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	satsRewardAddress := models.SatsRewardAddress{}
	userID := c.Locals("userID").(string)

	type RequestBody struct {
		QuizID string `json:"quizID"`
	}

	var body RequestBody
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	if body.QuizID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Please provide a quizID")
	}

	savedQuiz, err := quiz.FindOne(body.QuizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Quiz of provided id is not found!")
	}

	savedSatsRewardAddress, err := satsRewardAddress.FindDefaultAndVerifiedByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedSatsRewardAddress.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "No address found, make sure you have a verified address!")
	}

	// Publish an event to make sats reward payment
	satsRewardPaymentEventData := types.SatsRewardPaymentEventData{
		UserID: userID,
		QuizID: body.QuizID,
	}
	events.EB.Publish("MAKE_SATS_REWARD_PAYMENT", satsRewardPaymentEventData)

	log.Printf("Sats reward claim for quiz initialized: userID=%s, quizID=%s", userID, body.QuizID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Sats reward claim initialized!",
		"data":    nil,
	})
}
