package quizcategory

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var GetQuizCategory = func(c *fiber.Ctx) error {
	quizCategory := models.QuizCategory{}
	quizCategoryID := c.Params("id")

	savedQuizCategory, err := quizCategory.FindOne(quizCategoryID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuizCategory.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz Category of provided ID doesn't exist!")
	}

	response := fiber.Map{
		"status":  "success",
		"message": "Quiz Category fetched successfully!",
		"data":    savedQuizCategory,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
