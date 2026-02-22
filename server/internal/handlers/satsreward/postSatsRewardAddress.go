package satsreward

import (
	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

var PostSatsRewardAddress = func(c *fiber.Ctx) error {
	satsRewardAddress := models.SatsRewardAddress{}

	if err := c.BodyParser(&satsRewardAddress); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if satsRewardAddress.Address == "" || satsRewardAddress.UserID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Reward address and UserID are required!")
	}

	savedSatsRewardAddress, err := satsRewardAddress.FindByAddress(satsRewardAddress.Address)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedSatsRewardAddress.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "Reward address already exists!")
	}

	var userHasDefaultAddress bool = false

	allSavedUserSatsRewardAddress, err := satsRewardAddress.FindAllByUser(satsRewardAddress.UserID, 200, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if len(allSavedUserSatsRewardAddress) > 0 {
		for _, address := range allSavedUserSatsRewardAddress {
			if address.IsDefault {
				userHasDefaultAddress = true
				break
			}
		}
	}

	satsRewardAddress.IsVerified = false
	satsRewardAddress.IsDefault = !userHasDefaultAddress // If the user has no default address, set the new address as default

	createdSatsRewardAddress, err := satsRewardAddress.Create(satsRewardAddress)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Publish an event to verify the sats reward address
	satsRewardAddressEventData := types.SatsRewardAddressEventData{
		UserID:  satsRewardAddress.UserID,
		Address: satsRewardAddress.Address,
	}
	events.EB.Publish("VERIFY_SATS_REWARD_ADDRESS", satsRewardAddressEventData)

	response := map[string]interface{}{
		"status":  "success",
		"message": "Reward address created successfully!",
		"data":    createdSatsRewardAddress,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
