package quiz

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var SearchQuiz = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	query := c.Query("query")

	log.Println("query: ", query)

	quizzes, count, err := quiz.Search(query)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status": "success",
		"data":   quizzes,
		"count":  count,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
