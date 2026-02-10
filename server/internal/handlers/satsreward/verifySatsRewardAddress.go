package satsreward

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

var VerifySatsRewardAddress = func(c *fiber.Ctx) error {
	satsRewardAddress := models.SatsRewardAddress{}
	address := c.Params("address")

	if address == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Please provide an LnAddress")
	}

	satsRewardAddresses, err := satsRewardAddress.FindByAddress(address)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if satsRewardAddresses.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Sats reward address not found!")
	}

	if satsRewardAddresses.IsVerified {
		log.Printf("Sats reward address already verified: %s", satsRewardAddresses.Address)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "Sats reward address already verified!",
			"data":    satsRewardAddresses,
		})
	}

	// Publish an event to verify the sats reward address
	satsRewardAddressEventData := types.SatsRewardAddressEventData{
		UserID:  satsRewardAddresses.UserID,
		Address: satsRewardAddresses.Address,
	}
	events.EB.Publish("VERIFY_SATS_REWARD_ADDRESS", satsRewardAddressEventData)

	log.Printf("Sats reward address verification is still pending: %s", satsRewardAddresses.Address)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Sats reward address verification is still pending!",
		"data":    satsRewardAddresses,
	})
}
