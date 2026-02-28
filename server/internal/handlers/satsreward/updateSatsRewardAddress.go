package satsreward

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var UpdateSatsRewardAddress = func(c *fiber.Ctx) error {
	satsRewardAddress := models.SatsRewardAddress{}
	id := c.Params("id")

	if id == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Address ID is required!")
	}

	if err := c.BodyParser(&satsRewardAddress); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if satsRewardAddress.Address == "" {
		return fiber.NewError(fiber.StatusBadRequest, "New reward address is required!")
	}

	// Find the existing record
	savedSatsRewardAddress, err := satsRewardAddress.FindOne(id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedSatsRewardAddress.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Sats reward address not found!")
	}

	// Check uniqueness: ensure the new address is not already used by another record
	existingAddress, err := satsRewardAddress.FindByAddress(satsRewardAddress.Address)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if existingAddress.ID != "" && existingAddress.ID != id {
		return fiber.NewError(fiber.StatusBadRequest, "This reward address is already in use!")
	}

	// Update the address
	savedSatsRewardAddress.Address = satsRewardAddress.Address

	updatedSatsRewardAddress, err := savedSatsRewardAddress.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Reward address updated successfully!",
		"data":    updatedSatsRewardAddress,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
