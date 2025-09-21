package question

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/gofiber/fiber/v2"
)

var SearchQuestion = func(c *fiber.Ctx) error {
	question := models.Question{}
	quiz := models.Quiz{}
	quizID := c.Query("quizID")
	query := c.Query("query")

	log.Println("quizID: ", quizID)
	log.Println("query: ", query)

	savedQuiz, err := quiz.FindOne(quizID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if savedQuiz.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Quiz of provide ID doesn't exist")
	}

	questions, count, err := question.SearchByQuiz(quizID, query)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status": "success",
		"data":   questions,
		"count":  count,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
