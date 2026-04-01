package aipreview

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var UpdateAIPreview = func(c *fiber.Ctx) error {
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

	// Fetch the question with its answers to regenerate the AI summary
	question := models.Question{}
	questionData, err := question.FindOneAndIncludeAttachments(savedAIPreview.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if questionData.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Associated question not found!")
	}

	// Build answers data for the AI prompt
	var answers []map[string]interface{}
	for _, answer := range questionData.Answers {
		answers = append(answers, map[string]interface{}{
			"title":     answer.Title,
			"isCorrect": answer.IsCorrect,
		})
	}

	// Re-generate AI summary
	summary, prompt, err := pkg.GenerateAIPreviewSummary(questionData.Title, questionData.Introduction, answers)
	if err != nil {
		log.Printf("Error regenerating AI preview summary: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to regenerate AI preview: "+err.Error())
	}

	// Update the existing record
	savedAIPreview.Summary = summary
	savedAIPreview.Prompt = prompt

	updatedAIPreview, err := savedAIPreview.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "AI Preview updated successfully!",
		"data":    updatedAIPreview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
