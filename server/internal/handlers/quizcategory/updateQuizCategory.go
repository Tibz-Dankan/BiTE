package quizcategory

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var UpdateQuizCategory = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}
	quizCategoryID := c.Params("id")

	if err := c.BodyParser(&quizCategory); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if quizCategory.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest,
			"Missing name for quiz category!")
	}

	savedQuizCategory, err := quizCategory.FindOne(quizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz Category of provided ID doesn't exist!")
	}

	savedQuizCategory.Name = quizCategory.Name

	updatedQuizCategory, err := savedQuizCategory.Update()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Category updated successfully!",
		"data":    updatedQuizCategory,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}
