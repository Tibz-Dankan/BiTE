package quiz

import (
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetQuizzesByUserAndProgress = func(c *fiber.Ctx) error {
	quiz := models.Quiz{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")
	statusParam := c.Query("status")
	userID := c.Params("userID")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}
	if statusParam == "" {
		statusParam = ""
	}

	if userID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Please provide userID!")
	}

	pagination, allQuiz, err := quiz.FindAllByUserProgress(limit, cursorParam, userID, statusParam)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	response := fiber.Map{
		"status":     "success",
		"data":       allQuiz,
		"pagination": pagination,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
