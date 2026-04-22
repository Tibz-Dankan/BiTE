package aipreview

import (
	"fmt"
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

type PostAIPreviewsByQuizResult struct {
	QuestionID string `json:"questionID"`
	AIPreviewID string `json:"aiPreviewID"`
	Status     string `json:"status"`
	Message    string `json:"message"`
}

var PostAIPreviewsByQuiz = func(c *fiber.Ctx) error {
	quizID := c.Params("quizID")

	if quizID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "QuizID is required!")
	}

	// Validate quiz exists
	quiz := models.Quiz{}
	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provided ID doesn't exist!")
	}

	// Fetch all questions for this quiz with their answers
	question := models.Question{}
	questions, err := question.FindAllByQuiz(quizID, 500, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if len(questions) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "No questions found for this quiz!")
	}

	var results []PostAIPreviewsByQuizResult
	totalCreated := 0
	totalSkipped := 0
	totalErrors := 0

	for i, q := range questions {
		aiPreviewModel := models.AIPreview{}

		// Check if an AI preview already exists for this question
		existingPreviews, err := aiPreviewModel.FindByQuestionID(q.ID)
		if err != nil {
			log.Printf("Error checking existing AI previews for question %s: %v", q.ID, err)
			totalErrors++
			results = append(results, PostAIPreviewsByQuizResult{
				QuestionID: q.ID,
				Status:     "error",
				Message:    fmt.Sprintf("Error checking existing previews: %s", err.Error()),
			})
			continue
		}

		if len(existingPreviews) > 0 {
			totalSkipped++
			results = append(results, PostAIPreviewsByQuizResult{
				QuestionID: q.ID,
				Status:     "skipped",
				Message:    "AI preview already exists for this question",
			})
			continue
		}

		// Build answers data for the AI prompt
		var answers []map[string]interface{}
		for _, answer := range q.Answers {
			answers = append(answers, map[string]interface{}{
				"title":     answer.Title,
				"isCorrect": answer.IsCorrect,
			})
		}

		// Generate AI summary
		summary, prompt, err := pkg.GenerateAIPreviewSummary(q.Title, q.Introduction, answers)
		if err != nil {
			log.Printf("Error generating AI preview for question %s: %v", q.ID, err)
			totalErrors++
			results = append(results, PostAIPreviewsByQuizResult{
				QuestionID: q.ID,
				Status:     "error",
				Message:    fmt.Sprintf("Failed to generate AI preview: %s", err.Error()),
			})

			// Wait before retrying the next request even on error
			time.Sleep(5 * time.Second)
			continue
		}

		// Save the AI preview to the database
		newAIPreview := models.AIPreview{
			QuestionID: q.ID,
			Summary:    summary,
			Prompt:     prompt,
			IsDefault:  true,
		}

		createdAIPreview, err := aiPreviewModel.Create(newAIPreview)
		if err != nil {
			log.Printf("Error saving AI preview for question %s: %v", q.ID, err)
			totalErrors++
			results = append(results, PostAIPreviewsByQuizResult{
				QuestionID: q.ID,
				Status:     "error",
				Message:    fmt.Sprintf("Failed to save AI preview: %s", err.Error()),
			})
		} else {
			totalCreated++
			results = append(results, PostAIPreviewsByQuizResult{
				QuestionID:  q.ID,
				AIPreviewID: createdAIPreview.ID,
				Status:      "created",
				Message:     "AI preview created successfully",
			})
		}

		// Delay between requests to avoid rate limiting (skip delay for last question)
		if i < len(questions)-1 {
			time.Sleep(5 * time.Second)
		}
	}

	response := fiber.Map{
		"status":  "success",
		"message": fmt.Sprintf("AI previews processed for quiz: %d created, %d skipped, %d errors", totalCreated, totalSkipped, totalErrors),
		"data":    results,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
