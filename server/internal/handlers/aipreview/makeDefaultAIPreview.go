package aipreview

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var MakeDefaultAIPreview = func(c *fiber.Ctx) error {
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

	if savedAIPreview.IsDefault {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "This AI Preview is already the default!",
			"data":    savedAIPreview,
		})
	}

	// Remove default from all other AI previews for this question
	if err := aiPreview.RemoveDefaultByQuestion(savedAIPreview.QuestionID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Set this AI preview as default
	savedAIPreview.IsDefault = true

	updatedAIPreview, err := savedAIPreview.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "AI Preview set as default successfully!",
		"data":    updatedAIPreview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
