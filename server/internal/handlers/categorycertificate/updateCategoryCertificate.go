package categorycertificate

import (
	"fmt"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var UpdateCategoryCertificate = func(c *fiber.Ctx) error {
	categoryCertificate := models.CategoryCertificate{}
	quizCategory := models.QuizCategory{}
	quiz := models.Quiz{}
	ccq := models.CategoryCertificateQuizzes{}
	certificateID := c.Params("id")

	if err := c.BodyParser(&categoryCertificate); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if categoryCertificate.QuizCategoryID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing quizCategoryID!")
	}

	// Verify certificate exists
	savedCertificate, err := categoryCertificate.FindOne(certificateID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedCertificate.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Category Certificate of provided ID doesn't exist!")
	}

	// Validate quiz category exists
	savedQuizCategory, err := quizCategory.FindOne(categoryCertificate.QuizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz Category of provided ID doesn't exist!")
	}

	// Check if another certificate already exists for this category (exclude current)
	existingCertificate, err := categoryCertificate.FindByQuizCategoryID(categoryCertificate.QuizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if existingCertificate.ID != "" && existingCertificate.ID != certificateID {
		return fiber.NewError(fiber.StatusBadRequest, "A certificate already exists for this quiz category!")
	}

	// Fetch qualifying quizzes
	quizzes, err := quiz.FindAll(1000, "", categoryCertificate.QuizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var qualifyingQuizzes []models.Quiz
	for _, q := range quizzes {
		if q.CanBeAttempted && q.ShowQuiz {
			qualifyingQuizzes = append(qualifyingQuizzes, q)
		}
	}

	if len(qualifyingQuizzes) < 2 {
		return fiber.NewError(fiber.StatusBadRequest,
			fmt.Sprintf("Category must have at least 2 quizzes that are attemptable and visible. Found %d qualifying quiz(zes).", len(qualifyingQuizzes)))
	}

	// Delete old quiz links
	if err := ccq.DeleteByCertificate(certificateID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Create new quiz links
	for _, q := range qualifyingQuizzes {
		newQuizLink := models.CategoryCertificateQuizzes{
			CategoryCertificateID: certificateID,
			QuizID:                q.ID,
		}
		if _, err := ccq.Create(newQuizLink); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}

	// Update the certificate
	savedCertificate.QuizCategoryID = categoryCertificate.QuizCategoryID

	updatedCertificate, err := savedCertificate.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Category Certificate updated successfully!",
		"data":    updatedCertificate,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
