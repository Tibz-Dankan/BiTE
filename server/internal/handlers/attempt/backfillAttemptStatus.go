package attempt

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

func BackfillAttemptStatuses() {
	log.Println("Starting backfill of attempt statuses...")

	userModel := models.User{}
	users, err := userModel.FindAll()
	if err != nil {
		log.Printf("Error fetching users for backfill: %v", err)
		return
	}

	totalEventsPublished := 0

	for _, user := range users {
		attemptModel := models.Attempt{}
		attempts, err := attemptModel.FindUniqueAttemptsByUser(user.ID)
		if err != nil {
			log.Printf("Error fetching attempts for user %s: %v", user.ID, err)
			continue
		}

		for _, attempt := range attempts {
			// Publish an event to create attempt status
			eventData := types.AttemptStatusEventData{
				UserID:     user.ID,
				QuestionID: attempt.QuestionID,
			}
			events.EB.Publish("CREATE_ATTEMPT_STATUS", eventData)
			totalEventsPublished++
		}
	}

	log.Printf("Backfill completed. Published %d CREATE_ATTEMPT_STATUS events.", totalEventsPublished)
}

// func init() {
// 	go func() {
// 		time.Sleep(15 * time.Second)
// 		BackfillAttemptStatuses()
// 	}()
// }
