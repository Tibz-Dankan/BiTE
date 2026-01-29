package subscribers

import (
	"log"

	"github.com/Tibz-Dankan/BiTE/internal/events"
	"github.com/Tibz-Dankan/BiTE/internal/models"
	"github.com/Tibz-Dankan/BiTE/internal/types"
)

// UpdateQuizUserProgress subscribes to UPDATE_QUIZ_USER_PROGRESS event and creates/updates QuizUserProgress records
func UpdateQuizUserProgress() {
	go func() {
		quizUserProgressChan := make(chan events.DataEvent)
		events.EB.Subscribe("UPDATE_QUIZ_USER_PROGRESS", quizUserProgressChan)

		for {
			quizUserProgressEvent := <-quizUserProgressChan
			eventData, ok := quizUserProgressEvent.Data.(types.QuizUserProgressEventData)
			if !ok {
				log.Printf("Invalid QuizUserProgressEventData type received: %+v", quizUserProgressEvent.Data)
				continue
			}

			log.Printf("Processing UPDATE_QUIZ_USER_PROGRESS event for userID: %s, quizID: %s", eventData.UserID, eventData.QuizID)

			// Get total questions of the quiz
			question := models.Question{}
			totalQuestions, err := question.GetTotalCountByQuiz(eventData.QuizID)
			if err != nil {
				log.Printf("Error getting question count for quiz: %+v", err)
				continue
			}

			// Get total attempted questions of the quiz by the user
			attempt := models.Attempt{}
			totalAttemptedQuestions, err := attempt.GetAttemptedQuestionsCount(eventData.QuizID, eventData.UserID)
			if err != nil {
				log.Printf("Error getting question count for quiz: %+v", err)
				continue
			}

			log.Println("totalQuestions:", totalQuestions)
			log.Println("totalAttemptedQuestions:", totalAttemptedQuestions)

			if totalQuestions == 0 || totalAttemptedQuestions == 0 {
				log.Println("Quiz has no questions or user has not attempted any questions")
				continue
			}

			quizUserProgress := models.QuizUserProgress{}

			var status string = "IN_PROGRESS"
			if totalQuestions == totalAttemptedQuestions {
				status = "COMPLETED"
			}

			savedQuizUserProgress, err := quizUserProgress.FindOneByQuizAndUser(eventData.QuizID, eventData.UserID)
			if err != nil {
				log.Printf("Error getting savedQuizUserProgress by quiz and user : %+v", err)
				continue
			}

			// update existing quiz user progress
			if savedQuizUserProgress.ID != "" {
				savedQuizUserProgress.Status = status
				savedQuizUserProgress.TotalQuestions = totalQuestions
				savedQuizUserProgress.TotalAttemptedQuestions = totalAttemptedQuestions

				updatedQuizUserProgress, err := savedQuizUserProgress.Update()
				if err != nil {
					log.Printf("Error updating savedQuizUserProgress  : %+v", err)
					continue
				}
				log.Printf("updatedQuizUserProgress: %+v", updatedQuizUserProgress)
				log.Println("Quiz User Progress updated successfully!")
			}

			// create new quiz user progress
			if savedQuizUserProgress.ID == "" {
				quizUserProgressData := models.QuizUserProgress{
					UserID:                  eventData.UserID,
					QuizID:                  eventData.QuizID,
					TotalQuestions:          totalQuestions,
					TotalAttemptedQuestions: totalAttemptedQuestions,
					Status:                  status,
				}
				newQuizUserProgress, err := quizUserProgress.Create(quizUserProgressData)
				if err != nil {
					log.Printf("Error creating QuizUserProgress  : %+v", err)
					continue
				}
				log.Printf("newQuizUserProgress: %+v", newQuizUserProgress)
				log.Println("Quiz User Progress created successfully!")
			}

		}
	}()
}
