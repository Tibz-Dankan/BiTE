package chesspuzzle

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/gofiber/fiber/v2"
)

// ClaimChessPuzzleSatsReward is the recovery path for a puzzle win whose reward
// never reached COMPLETED — the user had no verified payout address when the
// puzzle was solved, or the payout failed.
//
// It only validates and publishes. The MakeChessPuzzleSatsRewardPayment
// subscriber remains the sole writer of SatsRewardChessPuzzle rows and the sole
// caller of Blink; that is what makes its COMPLETED guard authoritative against
// a claim racing the automatic payout.
var ClaimChessPuzzleSatsReward = func(c *fiber.Ctx) error {
	chessPuzzle := models.ChessPuzzle{}
	chessPuzzleRound := models.ChessPuzzleRound{}
	satsRewardChessPuzzle := models.SatsRewardChessPuzzle{}
	satsRewardAddress := models.SatsRewardAddress{}
	userID := c.Locals("userID").(string)

	type RequestBody struct {
		PuzzleID string `json:"puzzleID"`
	}

	var body RequestBody
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	if body.PuzzleID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Please provide a puzzleID")
	}

	savedPuzzle, err := chessPuzzle.FindOne(body.PuzzleID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedPuzzle.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "Puzzle of provided id is not found!")
	}

	// Establish the entitlement server-side rather than trusting the client.
	hasRewardableWin, err := chessPuzzleRound.HasRewardableWin(userID, body.PuzzleID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if !hasRewardableWin {
		return fiber.NewError(fiber.StatusBadRequest, "No rewardable win found for this puzzle!")
	}

	savedReward, err := satsRewardChessPuzzle.FindOneByUserAndPuzzle(userID, body.PuzzleID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedReward.Status == "COMPLETED" {
		return fiber.NewError(fiber.StatusBadRequest, "Sats reward already completed!")
	}

	savedSatsRewardAddress, err := satsRewardAddress.FindDefaultAndVerifiedByUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if savedSatsRewardAddress.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "No address found, make sure you have a verified address!")
	}

	// Publish an event to make sats reward payment
	chessPuzzleSatsRewardEventData := types.ChessPuzzleSatsRewardEventData{
		UserID:        userID,
		ChessPuzzleID: body.PuzzleID,
	}
	events.EB.Publish("MAKE_CHESS_PUZZLE_SATS_REWARD_PAYMENT", chessPuzzleSatsRewardEventData)

	log.Printf("Sats reward claim for chess puzzle initialized: userID=%s, puzzleID=%s", userID, body.PuzzleID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Sats reward claim initialized!",
		"data":    nil,
	})
}
