package satsreward

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

var ClaimQuizSatsReward = func(c *fiber.Ctx) error {
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
