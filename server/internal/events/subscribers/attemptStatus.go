package subscribers

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

// PostAttemptStatus subscribes to CREATE_ATTEMPT_STATUS event and creates AttemptStatus records
func PostAttemptStatus() {
	go func() {
		attemptStatusChan := make(chan events.DataEvent)
		events.EB.Subscribe("CREATE_ATTEMPT_STATUS", attemptStatusChan)

		for {
			attemptStatusEvent := <-attemptStatusChan
			eventData, ok := attemptStatusEvent.Data.(types.AttemptStatusEventData)
			if !ok {
				log.Printf("Invalid AttemptStatusEventData type received: %+v", attemptStatusEvent.Data)
				continue
			}

			log.Printf("Processing CREATE_ATTEMPT_STATUS event for userID: %s, questionID: %s", eventData.UserID, eventData.QuestionID)

			// Fetch the question with its answers
			question := models.Question{}
			savedQuestion, err := question.FindOneAndIncludeAttachments(eventData.QuestionID)
			if err != nil || savedQuestion.ID == "" {
				log.Printf("Error fetching question: %+v", err)
				continue
			}

			// Fetch all attempts for this user and question
			attempt := models.Attempt{}
			attempts, err := attempt.FindAllByUserAndQuestion(eventData.UserID, eventData.QuestionID)
			if err != nil {
				log.Printf("Error fetching attempts: %+v", err)
				continue
			}

			if len(attempts) == 0 {
				log.Printf("No attempts found for userID: %s, questionID: %s", eventData.UserID, eventData.QuestionID)
				continue
			}

			// Get correct answers from the question
			var correctAnswers []models.Answer
			for _, answer := range savedQuestion.Answers {
				if answer.IsCorrect {
					correctAnswers = append(correctAnswers, *answer)
				}
			}

			// Determine if the attempt is correct
			isCorrect := false

			if savedQuestion.RequiresNumericalAnswer {
				// For numerical answers, check if AnswerInput matches the Title of correct answer
				if len(correctAnswers) > 0 && attempts[0].AnswerInput == correctAnswers[0].Title {
					isCorrect = true
				}
			} else if savedQuestion.HasMultipleCorrectAnswers {
				// For multiple correct answers, all attempt answerIDs must match all correct answer IDs
				correctAnswerIDs := make(map[string]bool)
				for _, correctAns := range correctAnswers {
					correctAnswerIDs[correctAns.ID] = true
				}

				attemptAnswerIDs := make(map[string]bool)
				for _, att := range attempts {
					attemptAnswerIDs[att.AnswerID] = true
				}

				// Check if both maps have the same keys
				if len(correctAnswerIDs) == len(attemptAnswerIDs) {
					allMatch := true
					for correctID := range correctAnswerIDs {
						if !attemptAnswerIDs[correctID] {
							allMatch = false
							break
						}
					}
					isCorrect = allMatch
				}
			} else {
				// For single correct answer, check if any attempt answerID matches the correct answer ID
				if len(correctAnswers) > 0 {
					correctAnswerID := correctAnswers[0].ID
					for _, att := range attempts {
						if att.AnswerID == correctAnswerID {
							isCorrect = true
							break
						}
					}
				}
			}

			// Check if attempt status already exists for this user and question
			attemptStatusModel := models.AttemptStatus{}
			existingStatus, err := attemptStatusModel.FindByUserAndQuestion(eventData.UserID, eventData.QuestionID)
			if err == nil && existingStatus.ID != "" {
				log.Printf("Attempt status already exists for userID: %s, questionID: %s. Skipping creation.", eventData.UserID, eventData.QuestionID)
				continue
			}

			// Create a single AttemptStatus record for the question
			// We use the first attempt's ID as the reference AttemptID
			// The QuestionID is now explicitly stored in the AttemptStatus record
			attemptStatus := models.AttemptStatus{
				UserID:     eventData.UserID,
				AttemptID:  attempts[0].ID,
				QuestionID: eventData.QuestionID,
				IsCorrect:  isCorrect,
			}

			_, err = attemptStatusModel.Create(attemptStatus)
			if err != nil {
				log.Printf("Error creating attempt status: %+v", err)
				continue
			}

			log.Printf("Successfully created attempt status record for userID: %s, questionID: %s, isCorrect: %v",
				eventData.UserID, eventData.QuestionID, isCorrect)

			// Publish UPDATE_RANKING event
			rankingEventData := types.RankingEventData{
				UserID: eventData.UserID,
			}
			events.EB.Publish("UPDATE_RANKING", rankingEventData)
		}
	}()
}
