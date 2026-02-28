package satsreward

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/gofiber/fiber/v2"
)

var GetAllUserSatsRewardForQuizzes = func(c *fiber.Ctx) error {
	satsReward := models.SatsReward{}
	limitParam := c.Query("limit")
	cursorParam := c.Query("cursor")
	userID := c.Params("userID")

	limit, err := pkg.ValidateQueryLimit(limitParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if cursorParam == "" {
		cursorParam = ""
	}

	if userID != c.Locals("userID").(string) {
		return fiber.NewError(fiber.StatusForbidden, "Invalid userID provided!")
	}

	userQuizProgresses, pagination, err := satsReward.FindAllSatsClaimForUser(
		limit,
		cursorParam,
		userID,
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Printf("GetAllUserSatsRewardForQuizzes->userQuizProgresses: %+v", userQuizProgresses)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":     "success",
		"message":    "Quizzes to be rewarded with sats fetched successfully!",
		"data":       userQuizProgresses,
		"pagination": pagination,
	})
}
