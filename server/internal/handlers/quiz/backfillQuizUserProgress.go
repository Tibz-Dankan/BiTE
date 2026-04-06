package quiz

import (
	"log"
	"time"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

func BackfillQuizUserProgress() {
	log.Println("Starting backfill of backfill quiz user progress...")

	userModel := models.User{}
	users, err := userModel.FindAll()
	if err != nil {
		log.Printf("Error fetching users for backfill: %v", err)
		return
	}

	totalEventsPublished := 0

	for _, user := range users {
		quizModel := models.Quiz{}
		quizzes, err := quizModel.FindAll(100, "", "")
		if err != nil {
			log.Printf("Error fetching attempts for user %s: %v", user.ID, err)
			continue
		}

		for _, quiz := range quizzes {
			eventData := types.QuizUserProgressEventData{
				UserID: user.ID,
				QuizID: quiz.ID,
			}
			events.EB.Publish("UPDATE_QUIZ_USER_PROGRESS", eventData)
			totalEventsPublished++
		}
	}

	log.Printf("Backfill completed. Published %d UPDATE_QUIZ_USER_PROGRESS events.", totalEventsPublished)
}

func BackfillQuizUserProgressSince(since time.Time) {
	log.Printf("Starting backfill of backfill quiz user progress... since %v", since)

	attemptModel := models.Attempt{}
	attempts, err := attemptModel.FindUniqueAttemptsSince(since)
	if err != nil {
		log.Printf("Error fetching attempts for backfill: %v", err)
		return
	}

	log.Printf("Found %+v unique attempts since %v", attempts, since)

	totalEventsPublished := 0

	for _, attempt := range attempts {
		eventData := types.QuizUserProgressEventData{
			UserID: attempt.UserID,
			QuizID: attempt.QuizID,
		}
		events.EB.Publish("UPDATE_QUIZ_USER_PROGRESS", eventData)
		totalEventsPublished++
	}

	log.Printf("Backfill completed. Published %d UPDATE_QUIZ_USER_PROGRESS events.", totalEventsPublished)
}

// func init() {
// 	go func() {
// 		// time.Sleep(6 * time.Minute)
// 		time.Sleep(15 * time.Second)
// 		BackfillQuizUserProgress()
// 	}()
// }

// func init() {
// 	go func() {
// 		time.Sleep(2 * time.Minute) //Production
// 		// time.Sleep(15 * time.Second) //Development
// 		since := time.Date(2026, time.March, 30, 0, 0, 0, 0, time.UTC) //Production
// 		// since := time.Date(2026, time.January, 1, 0, 0, 0, 0, time.UTC) //Development
// 		BackfillQuizUserProgressSince(since)
// 	}()
// }
