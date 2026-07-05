package subscribers

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

// SATS_PER_CHESS_PUZZLE_WIN is the fixed reward paid for a first-encounter win.
// const SATS_PER_CHESS_PUZZLE_WIN = 40
const SATS_PER_CHESS_PUZZLE_WIN = 5

// MakeChessPuzzleSatsRewardPayment subscribes to MAKE_CHESS_PUZZLE_SATS_REWARD_PAYMENT
// and pays a fixed 40 sats to the user's verified Lightning address. It mirrors
// MakeSatsRewardPayment (quizzes) but keeps its audit self-contained on the
// SatsRewardChessPuzzle row (Status/Transaction/Info). Idempotent: a COMPLETED
// row is never paid twice.
func MakeChessPuzzleSatsRewardPayment() {
	go func() {
		chessPuzzleRewardChan := make(chan events.DataEvent)
		events.EB.Subscribe("MAKE_CHESS_PUZZLE_SATS_REWARD_PAYMENT", chessPuzzleRewardChan)

		for {
			rewardEvent := <-chessPuzzleRewardChan
			eventData, ok := rewardEvent.Data.(types.ChessPuzzleSatsRewardEventData)
			if !ok {
				log.Printf("Invalid ChessPuzzleSatsRewardEventData type received: %+v", rewardEvent.Data)
				continue
			}

			log.Printf("Processing MAKE_CHESS_PUZZLE_SATS_REWARD_PAYMENT event for userID: %s, chessPuzzleID: %s",
				eventData.UserID, eventData.ChessPuzzleID)

			walletID := os.Getenv("BLINK_WALLET_ID")
			satsRewardAddress := models.SatsRewardAddress{}
			chessReward := models.SatsRewardChessPuzzle{}

			savedSatsRewardAddress, err := satsRewardAddress.FindDefaultAndVerifiedByUser(eventData.UserID)
			if err != nil {
				log.Printf("Error finding sats reward address: %+v", err)
				continue
			}

			if savedSatsRewardAddress.ID == "" {
				log.Printf("No verified default sats reward address for user: %s", eventData.UserID)
				continue
			}

			savedReward, err := chessReward.FindOneByUserAndPuzzle(eventData.UserID, eventData.ChessPuzzleID)
			if err != nil {
				log.Printf("Error finding chess puzzle sats reward: %+v", err)
				continue
			}

			if savedReward.ID == "" {
				savedReward, err = chessReward.Create(models.SatsRewardChessPuzzle{
					UserID:              eventData.UserID,
					ChessPuzzleID:       eventData.ChessPuzzleID,
					SatsRewardAddressID: savedSatsRewardAddress.ID,
					Status:              "PENDING",
				})
				if err != nil {
					log.Printf("Error creating chess puzzle sats reward: %+v", err)
					continue
				}
			}

			if savedReward.Status == "COMPLETED" {
				log.Printf("Chess puzzle sats reward already completed for user: %s, chessPuzzleID: %s",
					eventData.UserID, eventData.ChessPuzzleID)
				continue
			}

			blinkClient := pkg.NewBlinkClient()

			result, err := blinkClient.SendLnAddressPayment(types.LnAddressPaymentSendInput{
				WalletId:  walletID,
				LnAddress: savedSatsRewardAddress.Address,
				Amount:    SATS_PER_CHESS_PUZZLE_WIN,
			})
			if err != nil {
				log.Printf("Error sending chess puzzle sats reward: %+v", err)
				savedReward.Status = "FAILED"
				savedReward.Info = err.Error()
				if _, uerr := savedReward.Update(); uerr != nil {
					log.Printf("Error updating failed chess puzzle sats reward: %+v", uerr)
				}
				continue
			}

			transactionJson, err := json.Marshal(&result.LnAddressPaymentSend.Transaction)
			if err != nil {
				log.Printf("Error marshalling chess puzzle transaction: %+v", err)
				savedReward.Status = "FAILED"
				savedReward.Info = err.Error()
				if _, uerr := savedReward.Update(); uerr != nil {
					log.Printf("Error updating failed chess puzzle sats reward: %+v", uerr)
				}
				continue
			}

			savedReward.Status = "COMPLETED"
			savedReward.Transaction = models.JSONB(transactionJson)
			savedReward.Info = fmt.Sprintf("%+v", result)
			if _, err := savedReward.Update(); err != nil {
				log.Printf("Error updating completed chess puzzle sats reward: %+v", err)
				continue
			}

			log.Printf("Chess puzzle sats reward sent successfully: %+v", result)
		}
	}()
}
