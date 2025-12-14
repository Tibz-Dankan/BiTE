package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (qd *QuizDuplicate) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (qd *QuizDuplicate) Create(quizDuplicate QuizDuplicate) (QuizDuplicate, error) {
	if err := db.Create(&quizDuplicate).Error; err != nil {
		return quizDuplicate, err
	}
	return quizDuplicate, nil
}
