package aipreview

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var CheckAIPreviewsByQuiz = func(c *fiber.Ctx) error {
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

	// Check if any AI previews exist for this quiz's questions
	aiPreview := models.AIPreview{}
	exists, err := aiPreview.ExistsByQuiz(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "AI preview existence check completed successfully!",
		"data": fiber.Map{
			"hasAIPreviews": exists,
		},
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
