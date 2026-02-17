package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (a *AttemptStatus) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (a *AttemptStatus) Create(attemptStatus AttemptStatus) (AttemptStatus, error) {
	if err := db.Create(&attemptStatus).Error; err != nil {
		return attemptStatus, err
	}

	return attemptStatus, nil
}

func (a *AttemptStatus) CreateMany(attemptStatuses []AttemptStatus) ([]AttemptStatus, error) {
	if err := db.Create(&attemptStatuses).Error; err != nil {
		return attemptStatuses, err
	}
	return attemptStatuses, nil
}

func (a *AttemptStatus) FindOne(id string) (AttemptStatus, error) {
	var attemptStatus AttemptStatus

	db.First(&attemptStatus, "id = ?", id)

	return attemptStatus, nil
}

func (a *AttemptStatus) FindByUserAndAttempt(userID string, attemptID string) (AttemptStatus, error) {
	var attemptStatus AttemptStatus

	db.Model(&AttemptStatus{}).
		Where("\"userID\" = ? AND \"attemptID\" = ?",
			userID, attemptID).First(&attemptStatus)

	return attemptStatus, nil
}

func (a *AttemptStatus) FindByUserAndQuestion(userID string, questionID string) (AttemptStatus, error) {
	var attemptStatus AttemptStatus

	db.Model(&AttemptStatus{}).
		Where("\"userID\" = ? AND \"questionID\" = ?",
			userID, questionID).First(&attemptStatus)

	return attemptStatus, nil
}

func (a *AttemptStatus) CountCorrectByUser(userID string) (int64, error) {
	var count int64

	if err := db.Model(&AttemptStatus{}).
		Where("\"userID\" = ? AND \"IsCorrect\" = ?", userID, true).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (a *AttemptStatus) CountCorrectByUserAndQuiz(userID string, quizID string) (int64, error) {
	var count int64
	var quizQuestionIDs []string

	// Get all quizQuestionIDs for this quiz
	if err := db.Model(&Question{}).
		Select("\"id\"").
		Where("\"quizID\" = ?", quizID).
		Pluck("\"id\"", &quizQuestionIDs).Error; err != nil {
		return 0, err
	}

	if err := db.Model(&AttemptStatus{}).
		Where(" \"questionID\" IN ? AND \"userID\" = ? AND \"IsCorrect\" = ?", quizQuestionIDs, userID, true).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (a *AttemptStatus) Update() (AttemptStatus, error) {
	db.Save(&a)

	return *a, nil
}

func (a *AttemptStatus) Delete(id string) error {

	if err := db.Unscoped().Where("id = ?", id).Delete(&AttemptStatus{}).Error; err != nil {
		return err
	}
	return nil
}

func (a *AttemptStatus) GetAverageCorrectScore() (float64, error) {
	var totalQuestionsAttempted int64
	var totalCorrectAnswers int64

	if err := db.Model(&AttemptStatus{}).Count(&totalQuestionsAttempted).Error; err != nil {
		return 0, err
	}

	if totalQuestionsAttempted == 0 {
		return 0, nil
	}

	if err := db.Model(&AttemptStatus{}).Where("\"IsCorrect\" = ?", true).Count(&totalCorrectAnswers).Error; err != nil {
		return 0, err
	}

	return (float64(totalCorrectAnswers) / float64(totalQuestionsAttempted)) * 100, nil
}

func (a *AttemptStatus) GetAverageCorrectScoreByUser(userID string) (float64, error) {
	var totalQuestionsAttempted int64
	var totalCorrectAnswers int64

	if err := db.Model(&AttemptStatus{}).Where("\"userID\" = ?", userID).Count(&totalQuestionsAttempted).Error; err != nil {
		return 0, err
	}

	if totalQuestionsAttempted == 0 {
		return 0, nil
	}

	if err := db.Model(&AttemptStatus{}).
		Where("\"userID\" = ? AND \"IsCorrect\" = ?", userID, true).
		Count(&totalCorrectAnswers).Error; err != nil {
		return 0, err
	}

	return (float64(totalCorrectAnswers) / float64(totalQuestionsAttempted)) * 100, nil
}
