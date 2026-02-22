package satsreward

import (
	"log"
	"os"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/pkg"
	"github.com/posthog/posthog-go"
)

func SendSatsRewardEmailNotifications() {
	userModel := models.User{}
	satsRewardModel := models.SatsReward{}

	// Sats Reward Feature Flag
	client, _ := posthog.NewWithConfig(
		os.Getenv("POSTHOG_API_KEY"),
		posthog.Config{
			// PersonalApiKey: "your personal API key", // Optional, but much more performant.  If this token is not supplied, then fetching feature flag values will be slower.
			Endpoint: "https://us.i.posthog.com",
		},
	)
	defer client.Close()

	isMyFlagEnabled, err := client.IsFeatureEnabled(posthog.FeatureFlagPayload{
		Key:        "sats-reward",
		DistinctId: "eventData.UserID",
	})
	if err != nil {
		log.Printf("Error getting feature flag value: %+v", err)
	}
	if isMyFlagEnabled == true {
		log.Printf("Feature flag enabled for rewards notification")
	}

	if isMyFlagEnabled == false {
		log.Printf("Feature flag disabled for rewards notification")
		return
	}

	users, err := userModel.FindByRole("USER")
	if err != nil {
		log.Println("Error fetching users by role USER:", err)
		return
	}

	for _, user := range users {
		// Find all unrewarded quizzes for the user
		// Using a large limit to get all potential rewards
		rewardData, _, err := satsRewardModel.FindAllSatsClaimForUser(100, "", user.ID)
		if err != nil {
			log.Printf("Error fetching rewards for user %s: %v\n", user.ID, err)
			continue
		}

		if len(rewardData) > 0 {
			var rewards []pkg.RewardInfo
			for _, data := range rewardData {
				quizMap, ok := data["quiz"].(*models.Quiz)
				if !ok {
					// Fallback if it's not a pointer
					quizVal, ok := data["quiz"].(models.Quiz)
					if ok {
						quizMap = &quizVal
					}
				}

				correctCount, ok := data["correctQuestionCount"].(int64)
				if !ok {
					// Try int if int64 fails (though GORM usually gives int64)
					if iconf, ok := data["correctQuestionCount"].(int); ok {
						correctCount = int64(iconf)
					}
				}

				if quizMap != nil && correctCount > 0 {
					rewards = append(rewards, pkg.RewardInfo{
						QuizTitle:  quizMap.Title,
						SatsAmount: correctCount, // 1 sat per correct question
					})
				}
			}

			if len(rewards) > 0 {
				email := pkg.Email{Recipient: user.Email}
				subject := "You have unclaimed Sats Rewards!"
				err := email.SendSatsRewardNotification(user.Name, rewards, subject)
				if err != nil {
					log.Printf("Error sending reward email to %s: %v\n", user.Email, err)
				} else {
					log.Printf("Reward email sent successfully to %s\n", user.Email)
				}
			}
		}
	}
}

func init() {
	go func() {
		time.Sleep(15 * time.Second)
		log.Println("Starting Sats Reward Email Notifications background task...")
		// SendSatsRewardEmailNotifications()

		// Run every 24 hours (or adjust as needed)
		ticker := time.NewTicker(24 * time.Hour)
		for range ticker.C {
			log.Println("Running scheduled Sats Reward Email Notifications...")
			// SendSatsRewardEmailNotifications()
		}
	}()
}
