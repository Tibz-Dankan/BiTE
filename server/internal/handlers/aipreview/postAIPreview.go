package aipreview

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var PostAIPreview = func(c *fiber.Ctx) error {
	aiPreview := models.AIPreview{}

	if err := c.BodyParser(&aiPreview); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if aiPreview.QuestionID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "QuestionID is required!")
	}

	// Fetch the question with its answers
	question := models.Question{}
	questionData, err := question.FindOneAndIncludeAttachments(aiPreview.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if questionData.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Question not found!")
	}

	// Build answers data for the AI prompt
	var answers []map[string]interface{}
	for _, answer := range questionData.Answers {
		answers = append(answers, map[string]interface{}{
			"title":     answer.Title,
			"isCorrect": answer.IsCorrect,
		})
	}

	// Generate AI summary
	summary, prompt, err := pkg.GenerateAIPreviewSummary(questionData.Title, questionData.Introduction, answers)
	if err != nil {
		log.Printf("Error generating AI preview summary: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to generate AI preview: "+err.Error())
	}

	// Check if there are existing AI previews for this question
	existingPreviews, err := aiPreview.FindByQuestionID(aiPreview.QuestionID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// If no existing previews, make this one the default
	aiPreview.IsDefault = len(existingPreviews) == 0
	aiPreview.Summary = summary
	aiPreview.Prompt = prompt

	createdAIPreview, err := aiPreview.Create(aiPreview)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "AI Preview created successfully!",
		"data":    createdAIPreview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
