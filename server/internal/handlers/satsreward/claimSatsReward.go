package satsreward

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

var ClaimSatsReward = func(c *fiber.Ctx) error {
	satsReward := models.SatsReward{}
	satsRewardID := c.Params("satsRewardID")
	userID := c.Locals("userID").(string)

	if satsRewardID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Please provide an satsRewardID")
	}

	satsReward, err := satsReward.FindOneAndIncludeUserQuizAndTransaction(satsRewardID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if userID != satsReward.UserID {
		return fiber.NewError(fiber.StatusBadRequest, "You have permissions to perform this action!")
	}

	if satsReward.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Sats reward not found!")
	}

	if satsReward.Status == "COMPLETED" {
		return fiber.NewError(fiber.StatusBadRequest, "Sats reward already completed!")
	}

	// 	Publish an event to make sats reward payment
	satsRewardPaymentEventData := types.SatsRewardPaymentEventData{
		UserID: satsReward.UserID,
		QuizID: satsReward.QuizID,
	}
	events.EB.Publish("MAKE_SATS_REWARD_PAYMENT", satsRewardPaymentEventData)

	log.Printf("Sats reward claim initialized: %s", satsReward.ID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Sats reward claim initialized!",
		"data":    satsReward,
	})
}
