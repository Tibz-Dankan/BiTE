package satsreward

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var MakeDefaultSatsRewardAddress = func(c *fiber.Ctx) error {
	satsRewardAddress := models.SatsRewardAddress{}
	id := c.Params("id")

	if id == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Address ID is required!")
	}

	// Find the existing record
	savedSatsRewardAddress, err := satsRewardAddress.FindOne(id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedSatsRewardAddress.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Sats reward address not found!")
	}

	if savedSatsRewardAddress.IsDefault {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "This address is already the default!",
			"data":    savedSatsRewardAddress,
		})
	}

	// Remove default from all other addresses for this user
	if err := satsRewardAddress.RemoveDefaultByUser(savedSatsRewardAddress.UserID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Set this address as default
	savedSatsRewardAddress.IsDefault = true

	updatedSatsRewardAddress, err := savedSatsRewardAddress.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Reward address set as default successfully!",
		"data":    updatedSatsRewardAddress,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
