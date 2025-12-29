package models

import (
	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (a *Attempt) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (a *Attempt) Create(attempt Attempt) (Attempt, error) {
	if err := db.Create(&attempt).Error; err != nil {
		return attempt, err
	}

	return attempt, nil
}

func (a *Attempt) CreateMany(attempts []Attempt) ([]Attempt, error) {
	if err := db.Create(&attempts).Error; err != nil {
		return attempts, err
	}
	return attempts, nil
}

func (a *Attempt) FindOne(id string) (Attempt, error) {
	var attempt Attempt

	db.First(&attempt, "id = ?", id)

	return attempt, nil
}

func (a *Attempt) FindOneByQuestionAnswerAndUser(questionID string, answerID string, userID string) (Attempt, error) {
	var attempt Attempt

	db.Model(&Attempt{}).
		Where("\"questionID\" = ? AND \"answerID\" = ? AND \"userID\" = ?",
			questionID, answerID, userID).First(&attempt)

	return attempt, nil
}

func (a *Attempt) FindLastAttemptByQuizAndUser(quizID string, userID string) (Attempt, error) {
	var attempt Attempt

	if err := db.Model(&Attempt{}).
		Where("\"quizID\" = ? AND \"userID\" = ?",
			quizID, userID).Order("\"createdAt\" DESC").First(&attempt).Error; err != nil {
		return attempt, err
	}

	return attempt, nil
}

// FindProgressByQuizAndUser returns the progress of a user's attempt for a specific quiz.
// Returns total questions, total attempts, and status
func (a *Attempt) FindProgressByQuizAndUser(quizID string, userID string) (int64, int64, string, error) {
	var totalQuestions, totalAttemptedQuestions int64
	var status string

	if err := db.Model(&Question{}).Where("\"quizID\" = ?", quizID).
		Count(&totalQuestions).Error; err != nil && err.Error() != constants.RECORD_NOT_FOUND_ERROR {
		return totalQuestions, totalAttemptedQuestions, status, err
	}

	if err := db.Model(&Attempt{}).Where("\"quizID\" = ? AND \"userID\" = ?",
		quizID, userID).Distinct("\"questionID\"").Count(&totalAttemptedQuestions).Error; err != nil && err.Error() != constants.RECORD_NOT_FOUND_ERROR {
		return totalQuestions, totalAttemptedQuestions, status, err
	}

	if totalAttemptedQuestions == totalQuestions {
		status = "COMPLETED"
	} else {
		status = "IN_PROGRESS"
	}

	return totalQuestions, totalAttemptedQuestions, status, nil
}

// FindAllByUserAndQuestion returns all attempts for a specific user and question
func (a *Attempt) FindAllByUserAndQuestion(userID string, questionID string) ([]Attempt, error) {
	var attempts []Attempt

	if err := db.Model(&Attempt{}).
		Where("\"userID\" = ? AND \"questionID\" = ?", userID, questionID).
		Find(&attempts).Error; err != nil {
		return attempts, err
	}

	return attempts, nil
}

// CountDistinctQuestionsByUser counts unique questionIDs for a user (for TotalAttempts calculation)
func (a *Attempt) CountDistinctQuestionsByUser(userID string) (int64, error) {
	var count int64

	if err := db.Model(&Attempt{}).
		Where("\"userID\" = ?", userID).
		Distinct("\"questionID\"").
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// FindUniqueAttemptsByUser returns a list of attempts with unique QuestionIDs for a specific user
func (a *Attempt) FindUniqueAttemptsByUser(userID string) ([]Attempt, error) {
	var attempts []Attempt

	if err := db.Model(&Attempt{}).
		Where("\"userID\" = ?", userID).
		Distinct("\"questionID\"").
		Find(&attempts).Error; err != nil {
		return attempts, err
	}

	return attempts, nil
}

// Update updates an attempt
func (a *Attempt) Update() (Attempt, error) {
	db.Save(&a)

	return *a, nil
}

func (a *Attempt) Delete(id string) error {

	if err := db.Unscoped().Where("id = ?", id).Delete(&Attempt{}).Error; err != nil {
		return err
	}
	return nil
}

// GetTotalQuizzesAttemptedByUser counts the number of distinct quizzes a user has attempted
func (a *Attempt) GetTotalQuizzesAttemptedByUser(userID string) (int64, error) {
	var count int64

	if err := db.Model(&Attempt{}).
		Where("\"userID\" = ?", userID).
		Distinct("\"quizID\"").
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// GetTotalDistinctQuestionsAttempted counts the total number of distinct questions attempted by all users
func (a *Attempt) GetTotalDistinctQuestionsAttempted() (int64, error) {
	var count int64

	if err := db.Model(&Attempt{}).
		Distinct("\"questionID\"").
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// GetTotalDistinctQuizzesAttempted counts the total number of distinct quizzes attempted by all users
func (a *Attempt) GetTotalDistinctQuizzesAttempted() (int64, error) {
	var count int64

	if err := db.Model(&Attempt{}).
		Distinct("\"quizID\"").
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (a *Attempt) GetCorrectQuestionsCount(quizID string, userID string) (int64, error) {
	var attemptIDs []string

	// Get all attemptIDs for this user and quiz
	if err := db.Model(&Attempt{}).
		Select("id").
		Where("\"quizID\" = ? AND \"userID\" = ?", quizID, userID).
		Pluck("id", &attemptIDs).Error; err != nil {
		return 0, err
	}

	if len(attemptIDs) == 0 {
		return 0, nil
	}

	var count int64

	// Count AttemptStatus records where IsCorrect is true for those attemptIDs
	if err := db.Model(&AttemptStatus{}).
		Where("\"attemptID\" IN ? AND \"IsCorrect\" = ?", attemptIDs, true).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
