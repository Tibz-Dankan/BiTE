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
	"github.com/posthog/posthog-go"
)

// MakeSatsRewardPayment subscribes to MAKE_SATS_REWARD_PAYMENT event and
// sends sats reward to the user
func MakeSatsRewardPayment() {
	client, _ := posthog.NewWithConfig(
		os.Getenv("POSTHOG_API_KEY"),
		posthog.Config{
			PersonalApiKey: os.Getenv("POSTHOG_BITE_PERSONAL_KEY"), // Optional, but much more performant.  If this token is not supplied, then fetching feature flag values will be slower.
			Endpoint:       "https://us.i.posthog.com",
		},
	)
	defer client.Close()

	go func() {
		satsRewardPaymentChan := make(chan events.DataEvent)
		events.EB.Subscribe("MAKE_SATS_REWARD_PAYMENT", satsRewardPaymentChan)

		for {
			satsRewardPaymentEvent := <-satsRewardPaymentChan
			eventData, ok := satsRewardPaymentEvent.Data.(types.SatsRewardPaymentEventData)
			if !ok {
				log.Printf("Invalid SatsRewardPaymentEventData type received: %+v", satsRewardPaymentEvent.Data)
				continue
			}

			log.Printf("Processing MAKE_SATS_REWARD_PAYMENT event for userID: %s, quizID: %s", eventData.UserID, eventData.QuizID)

			// Sats Reward Feature Flag
			isMyFlagEnabled, err := client.IsFeatureEnabled(posthog.FeatureFlagPayload{
				Key:        "sats-reward-backend",
				DistinctId: eventData.UserID,
			})
			if err != nil {
				log.Printf("Error getting feature flag value: %+v", err)
			}
			if isMyFlagEnabled == true {
				log.Printf("Feature flag enabled for user: %s", eventData.UserID)
			}

			if isMyFlagEnabled == false {
				log.Printf("Feature flag disabled for user: %s", eventData.UserID)
				continue
			}

			const SATS_PER_CORRECT_QUESTION = 1
			walletID := os.Getenv("BLINK_WALLET_ID")
			satsReward := models.SatsReward{}
			satsRewardAddress := models.SatsRewardAddress{}
			satsRewardTransaction := models.SatsRewardTransaction{}

			savedSatsRewardAddress, err := satsRewardAddress.FindDefaultAndVerifiedByUser(eventData.UserID)
			if err != nil {
				log.Printf("Error finding sats reward address: %+v", err)
				continue
			}

			if savedSatsRewardAddress.ID == "" {
				log.Printf("No sats reward address found for user: %s", eventData.UserID)
				continue
			}

			log.Printf("Found sats reward address: %+v", savedSatsRewardAddress)

			savedSatsReward, err := satsReward.FindOneByUserAndQuiz(eventData.UserID, eventData.QuizID)
			if err != nil {
				log.Printf("Error finding sats reward: %+v", err)
				continue
			}

			if savedSatsReward.ID == "" {
				savedSatsReward, err = satsReward.Create(models.SatsReward{
					UserID:              eventData.UserID,
					QuizID:              eventData.QuizID,
					SatsRewardAddressID: savedSatsRewardAddress.ID,
					Status:              "PENDING",
				})
				if err != nil {
					log.Printf("Error creating sats reward: %+v", err)
					continue
				}
			}

			if savedSatsReward.Status == "COMPLETED" {
				log.Printf("Sats reward already completed for user: %s, quizID: %s", eventData.UserID, eventData.QuizID)
				continue
			}

			correctQuestionCount, correctQuestionIDs, err := savedSatsReward.GetCorrectQuestionCountForReward(eventData.UserID, eventData.QuizID)
			if err != nil {
				log.Printf("Error getting correct question count for reward: %+v", err)
				continue
			}

			log.Printf("Correct question count for reward: %d", correctQuestionCount)
			log.Printf("Correct question IDs for reward: %+v", correctQuestionIDs)

			satsRewardAmount := correctQuestionCount * SATS_PER_CORRECT_QUESTION
			// satsRewardAmount := int64(1)
			log.Printf("Sats reward amount: %d", satsRewardAmount)

			if satsRewardAmount <= 0 {
				log.Printf("Sats reward amount is less than or equal to 0: %d", satsRewardAmount)

				// Save sats reward operation as failed
				if err := saveSatsRewardOperation(models.SatsRewardOperation{
					SatsRewardID: savedSatsReward.ID,
					Status:       "FAILED",
					Info:         "Sats reward amount is less than or equal to 0",
				}); err != nil {
					continue
				}
				continue
			}

			blinkClient := pkg.NewBlinkClient()

			result, err := blinkClient.SendLnAddressPayment(types.LnAddressPaymentSendInput{
				WalletId:  walletID,
				LnAddress: savedSatsRewardAddress.Address,
				Amount:    satsRewardAmount,
			})

			if err != nil {
				log.Printf("Error sending sats reward: %+v", err)

				// Save sats reward operation as failed
				if err := saveSatsRewardOperation(models.SatsRewardOperation{
					SatsRewardID: savedSatsReward.ID,
					Status:       "FAILED",
					Info:         err.Error(),
				}); err != nil {
					continue
				}
				continue
			}

			transactionJson, err := json.Marshal(&result.LnAddressPaymentSend.Transaction)
			if err != nil {
				log.Printf("Error Marshalling transaction:%+v\n", err)

				// Save sats reward operation as failed
				if err := saveSatsRewardOperation(models.SatsRewardOperation{
					SatsRewardID: savedSatsReward.ID,
					Status:       "FAILED",
					Info:         err.Error(),
				}); err != nil {
					log.Printf("Error creating sats reward operation: %+v", err)
					continue
				}
				continue
			}

			rewardedQuestionIDsJson, err := json.Marshal(&correctQuestionIDs)
			if err != nil {
				log.Printf("Error Marshalling rewarded question IDs:%+v\n", err)

				// Save sats reward operation as failed
				if err := saveSatsRewardOperation(models.SatsRewardOperation{
					SatsRewardID: savedSatsReward.ID,
					Status:       "FAILED",
					Info:         err.Error(),
				}); err != nil {
					log.Printf("Error creating sats reward operation: %+v", err)
					continue
				}
				continue
			}

			createdTransaction, err := satsRewardTransaction.Create(models.SatsRewardTransaction{
				SatsRewardID:        savedSatsReward.ID,
				Transaction:         models.JSONB(transactionJson),
				RewardedQuestionIDs: models.JSONB(rewardedQuestionIDsJson),
			})
			if err != nil {
				log.Printf("Error creating sats reward transaction: %+v", err)

				// Save sats reward operation as failed
				if err := saveSatsRewardOperation(models.SatsRewardOperation{
					SatsRewardID: savedSatsReward.ID,
					Status:       "FAILED",
					Info:         err.Error(),
				}); err != nil {
					log.Printf("Error creating sats reward operation: %+v", err)
					continue
				}
				continue
			}
			log.Printf("Created sats reward transaction: %+v", createdTransaction)

			satsReward.ID = savedSatsReward.ID
			satsReward.UserID = eventData.UserID
			satsReward.QuizID = eventData.QuizID
			satsReward.SatsRewardAddressID = savedSatsRewardAddress.ID
			satsReward.CreatedAt = savedSatsRewardAddress.CreatedAt
			satsReward.Status = "COMPLETED"

			updatedSatsReward, err := satsReward.Update()
			if err != nil {
				log.Printf("Error updating sats reward: %+v", err)

				// Save sats reward operation as failed
				if err := saveSatsRewardOperation(models.SatsRewardOperation{
					SatsRewardID: savedSatsReward.ID,
					Status:       "FAILED",
					Info:         err.Error(),
				}); err != nil {
					log.Printf("Error creating sats reward operation: %+v", err)
					continue
				}
				continue
			}

			log.Printf("Updated sats reward: %+v", updatedSatsReward)

			// Save sats reward operation as success
			if err := saveSatsRewardOperation(models.SatsRewardOperation{
				SatsRewardID: savedSatsReward.ID,
				Status:       "SUCCESS",
				Info:         fmt.Sprintf("%+v", result),
			}); err != nil {
				log.Printf("Error creating sats reward operation: %+v", err)
				continue
			}

			// To send an email to the user here
			log.Printf("Sats reward sent successfully: %+v", result)
		}
	}()
}

func saveSatsRewardOperation(satsRewardOperation models.SatsRewardOperation) error {
	createdSatsRewardOperation, err := satsRewardOperation.Create(satsRewardOperation)
	if err != nil {
		log.Printf("Error creating sats reward operation: %+v", err)
		return err
	}
	log.Printf("Created sats reward operation: %+v", createdSatsRewardOperation)
	return nil
}
