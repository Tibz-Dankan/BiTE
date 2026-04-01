package aipreview

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetAIPreview = func(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return fiber.NewError(fiber.StatusBadRequest, "AI Preview ID is required!")
	}

	aiPreview := models.AIPreview{}
	savedAIPreview, err := aiPreview.FindOne(id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedAIPreview.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "AI Preview not found!")
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "AI Preview fetched successfully!",
		"data":    savedAIPreview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
