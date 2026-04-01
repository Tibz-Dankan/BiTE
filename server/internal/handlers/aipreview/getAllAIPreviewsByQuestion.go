package aipreview

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetAllAIPreviewsByQuestion = func(c *fiber.Ctx) error {
	questionID := c.Params("questionID")

	if questionID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Question ID is required!")
	}

	aiPreview := models.AIPreview{}
	aiPreviews, err := aiPreview.FindByQuestionID(questionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "AI Previews fetched successfully!",
		"data":    aiPreviews,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
