package subscribers

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

// UpdateRanking subscribes to UPDATE_RANKING event and updates user ranking
func UpdateRanking() {
	go func() {
		rankingChan := make(chan events.DataEvent)
		events.EB.Subscribe("UPDATE_RANKING", rankingChan)

		for {
			rankingEvent := <-rankingChan
			eventData, ok := rankingEvent.Data.(types.RankingEventData)
			if !ok {
				log.Printf("Invalid RankingEventData type received: %+v", rankingEvent.Data)
				continue
			}

			log.Printf("Processing UPDATE_RANKING event for userID: %s", eventData.UserID)

			// Calculate TotalDuration
			attemptDuration := models.AttemptDuration{}
			totalDuration, err := attemptDuration.GetTotalDurationByUser(eventData.UserID)
			if err != nil {
				log.Printf("Error getting total duration: %+v", err)
				continue
			}

			// Calculate TotalAttempts (distinct questions)
			attempt := models.Attempt{}
			totalAttempts, err := attempt.CountDistinctQuestionsByUser(eventData.UserID)
			if err != nil {
				log.Printf("Error counting distinct questions: %+v", err)
				continue
			}

			// Calculate TotalCorrectAttempts
			attemptStatus := models.AttemptStatus{}
			totalCorrectAttempts, err := attemptStatus.CountCorrectByUser(eventData.UserID)
			if err != nil {
				log.Printf("Error counting correct attempts: %+v", err)
				continue
			}

			// Upsert ranking record
			ranking := models.Ranking{
				UserID:               eventData.UserID,
				TotalDuration:        totalDuration,
				TotalAttempts:        totalAttempts,
				TotalCorrectAttempts: totalCorrectAttempts,
			}

			rankingModel := models.Ranking{}
			savedRanking, err := rankingModel.Upsert(ranking)
			if err != nil {
				log.Printf("Error upserting ranking: %+v", err)
				continue
			}

			log.Printf("Successfully upserted ranking for userID: %s (ID: %s, TotalAttempts: %d, TotalCorrectAttempts: %d, TotalDuration: %d)",
				eventData.UserID, savedRanking.ID, totalAttempts, totalCorrectAttempts, totalDuration)

			// Recalculate all ranks
			err = rankingModel.RecalculateAllRanks()
			if err != nil {
				log.Printf("Error recalculating all ranks: %+v", err)
				continue
			}

			log.Printf("Successfully recalculated all user ranks")
		}
	}()
}
