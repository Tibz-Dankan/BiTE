package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (a *AttemptDuration) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (a *AttemptDuration) Create(attemptDuration AttemptDuration) (AttemptDuration, error) {
	if err := db.Create(&attemptDuration).Error; err != nil {
		return attemptDuration, err
	}

	return attemptDuration, nil
}

func (a *AttemptDuration) FindOne(id string) (AttemptDuration, error) {
	var attemptDuration AttemptDuration

	db.First(&attemptDuration, "id = ?", id)

	return attemptDuration, nil
}

func (a *AttemptDuration) FindOneByQuizAndUser(quizID string, userID string) (AttemptDuration, error) {
	var attemptDuration AttemptDuration

	db.Model(&AttemptDuration{}).
		Where("\"quizID\" = ? AND \"userID\" = ?",
			quizID, userID).First(&attemptDuration)

	return attemptDuration, nil
}

func (a *AttemptDuration) Update() (AttemptDuration, error) {
	db.Save(&a)

	return *a, nil
}

func (a *AttemptDuration) Delete(id string) error {

	if err := db.Unscoped().Where("id = ?", id).Delete(&AttemptDuration{}).Error; err != nil {
		return err
	}
	return nil
}
