package types

import (
	"time"
)

type UserQuizProgressForReward struct {
	ID                      string      `json:"id"`
	UserID                  string      `json:"userID"`
	QuizID                  string      `json:"quizID"`
	TotalQuestions          int64       `json:"totalQuestions"`
	TotalAttemptedQuestions int64       `json:"totalAttemptedQuestions"`
	Status                  string      `json:"status"`
	CreatedAt               time.Time   `json:"createdAt"`
	UpdatedAt               time.Time   `json:"updatedAt"`
	User                    interface{} `json:"user"`
	Quiz                    interface{} `json:"quiz"`
	CorrectQuestionCount    int64       `json:"correctQuestionCount"`
}
