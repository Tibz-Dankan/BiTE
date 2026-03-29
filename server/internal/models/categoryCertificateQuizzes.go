package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (ccq *CategoryCertificateQuizzes) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (ccq *CategoryCertificateQuizzes) Create(quizLink CategoryCertificateQuizzes) (CategoryCertificateQuizzes, error) {
	if err := db.Create(&quizLink).Error; err != nil {
		return quizLink, err
	}

	return quizLink, nil
}

func (ccq *CategoryCertificateQuizzes) FindAllByCertificate(categoryCertificateID string) ([]CategoryCertificateQuizzes, error) {
	var quizLinks []CategoryCertificateQuizzes

	db.Model(&CategoryCertificateQuizzes{}).
		Preload("Quiz").
		Where("\"categoryCertificateID\" = ?", categoryCertificateID).
		Find(&quizLinks)

	return quizLinks, nil
}

func (ccq *CategoryCertificateQuizzes) DeleteByCertificate(categoryCertificateID string) error {
	if err := db.Unscoped().Where("\"categoryCertificateID\" = ?", categoryCertificateID).
		Delete(&CategoryCertificateQuizzes{}).Error; err != nil {
		return err
	}
	return nil
}
