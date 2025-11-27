package quizcategory

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var PostQuizCategory = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}

	if err := c.BodyParser(&quizCategory); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if quizCategory.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing name for quiz category!")
	}

	savedQuizCategory, err := quizCategory.FindByName(quizCategory.Name)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID != "" {
		return fiber.NewError(fiber.StatusBadRequest, "Provided name already exists!")
	}

	newQuizCategory, err := quizCategory.Create(quizCategory)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Category created successfully!",
		"data":    newQuizCategory,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
