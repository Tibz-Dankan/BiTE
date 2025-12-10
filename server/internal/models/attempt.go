package models

import (
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
