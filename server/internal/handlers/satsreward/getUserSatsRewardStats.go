package satsreward

import (
	"encoding/json"
	"log"
	"math"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

var GetUserSatsRewardStats = func(c *fiber.Ctx) error {
	satsReward := models.SatsReward{}
	userID := c.Params("userID")

	if userID != c.Locals("userID").(string) {
		return fiber.NewError(fiber.StatusForbidden, "Invalid userID provided!")
	}

	userQuizProgressForRewards, _, err := satsReward.FindAllSatsClaimForUserStats(
		1500,
		"",
		userID,
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	satsRewards, err := satsReward.FindAllByUser(userID, 1500, "")
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	var totalSatsToBeClaimed int64
	var totalSatsEarned int64

	// Get total sats to be claimed
	for _, usrQuizProgressForReward := range userQuizProgressForRewards {
		totalSatsToBeClaimed += int64(usrQuizProgressForReward.CorrectQuestionCount)
	}

	for _, satsReward := range satsRewards {
		if satsReward.Status != "COMPLETED" {
			log.Printf("Sats reward is not completed! %+v", satsReward)
			continue
		}
		for _, satsRewardTransaction := range satsReward.SatsRewardTransaction {
			var dimensions types.TransactionDetail
			if err := json.Unmarshal(satsRewardTransaction.Transaction, &dimensions); err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}
			totalSatsEarned += int64(math.Abs(float64(dimensions.SettlementAmount)))
		}
	}

	rewardStats := fiber.Map{
		"totalSatsToBeClaimed": totalSatsToBeClaimed,
		"totalSatsEarned":      totalSatsEarned,
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "User sats reward stats fetched successfully!",
		"data":    rewardStats,
	})
}
