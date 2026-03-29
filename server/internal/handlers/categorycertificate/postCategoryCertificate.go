package categorycertificate

import (
	"fmt"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var PostCategoryCertificate = func(c *fiber.Ctx) error {
	categoryCertificate := models.CategoryCertificate{}
	quizCategory := models.QuizCategory{}
	quiz := models.Quiz{}

	if err := c.BodyParser(&categoryCertificate); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if categoryCertificate.QuizCategoryID == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing quizCategoryID!")
	}

	// Validate quiz category exists
	savedQuizCategory, err := quizCategory.FindOne(categoryCertificate.QuizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz Category of provided ID doesn't exist!")
	}

	// Check no existing certificate for this category
	existingCertificate, err := categoryCertificate.FindByQuizCategoryID(categoryCertificate.QuizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if existingCertificate.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "A certificate already exists for this quiz category!")
	}

	// Fetch quizzes in category where canBeAttempted=true AND showQuiz=true
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

	// Build CategoryCertificateQuizzes from qualifying quizzes
	var certificateQuizzes []*models.CategoryCertificateQuizzes
	for _, q := range qualifyingQuizzes {
		certificateQuiz := &models.CategoryCertificateQuizzes{
			QuizID: q.ID,
		}
		certificateQuizzes = append(certificateQuizzes, certificateQuiz)
	}

	categoryCertificate.CategoryCertificateQuizzes = certificateQuizzes

	newCertificate, err := categoryCertificate.Create(categoryCertificate)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Category Certificate created successfully!",
		"data":    newCertificate,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
