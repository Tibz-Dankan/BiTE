package types

// AttemptStatusEventData represents the data published with CREATE_ATTEMPT_STATUS event
type AttemptStatusEventData struct {
	UserID     string
	QuestionID string
}

// RankingEventData represents the data published with UPDATE_RANKING event
type RankingEventData struct {
	UserID string
}

// QuizUserProgressEventData represents the data published with UPDATE_QUIZ_USER_PROGRESS event
type QuizUserProgressEventData struct {
	UserID string
	QuizID string
}
