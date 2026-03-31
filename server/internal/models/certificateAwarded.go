package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (ca *CertificateAwarded) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (ca *CertificateAwarded) Create(certificateAwarded CertificateAwarded) (CertificateAwarded, error) {
	if err := db.Create(&certificateAwarded).Error; err != nil {
		return certificateAwarded, err
	}

	return certificateAwarded, nil
}

func (ca *CertificateAwarded) FindByUserAndCertificate(userID string, categoryCertificateID string) (CertificateAwarded, error) {
	var certificate CertificateAwarded

	db.Model(&CertificateAwarded{}).
		Preload("User").
		Where("\"userID\" = ? AND \"categoryCertificateID\" = ?", userID, categoryCertificateID).
		First(&certificate)

	return certificate, nil
}

func (ca *CertificateAwarded) FindByUserAndCertificateWithPreloads(userID string, categoryCertificateID string) (CertificateAwarded, error) {
	var certificate CertificateAwarded

	db.Model(&CertificateAwarded{}).
		Preload("User").
		Preload("CategoryCertificate.QuizCategory").
		Preload("CategoryCertificate.QuizCategory.Quizzes").
		Preload("CategoryCertificate.QuizCategory.Quizzes.Attachments").
		Preload("CategoryCertificate.QuizCategory.Attachments").
		Where("\"userID\" = ? AND \"categoryCertificateID\" = ?", userID, categoryCertificateID).
		First(&certificate)

	return certificate, nil
}

func (ca *CertificateAwarded) CountByCertificate(categoryCertificateID string) (int64, error) {
	var count int64

	if err := db.Model(&CertificateAwarded{}).
		Where("\"categoryCertificateID\" = ?", categoryCertificateID).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (ca *CertificateAwarded) FindAll(limit float64, cursor string) ([]CertificateAwarded, error) {
	var certificates []CertificateAwarded

	query := db.Model(&CertificateAwarded{}).
		Preload("User").
		Preload("CategoryCertificate.QuizCategory").
		Preload("CategoryCertificate.QuizCategory.Quizzes").
		Preload("CategoryCertificate.QuizCategory.Quizzes.Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastCertificate CertificateAwarded
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastCertificate).Error; err != nil {
			return certificates, err
		}
		query = query.Where("\"createdAt\" < ?", lastCertificate.CreatedAt)
	}

	query.Find(&certificates)

	return certificates, nil
}

func (ca *CertificateAwarded) FindAllByUser(userID string, limit float64, cursor string) ([]CertificateAwarded, error) {
	var certificates []CertificateAwarded

	query := db.Model(&CertificateAwarded{}).
		Preload("User").
		Preload("CategoryCertificate.QuizCategory").
		Preload("CategoryCertificate.QuizCategory.Quizzes").
		Preload("CategoryCertificate.QuizCategory.Quizzes.Attachments").
		Where("\"userID\" = ?", userID).
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastCertificate CertificateAwarded
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastCertificate).Error; err != nil {
			return certificates, err
		}
		query = query.Where("\"createdAt\" < ?", lastCertificate.CreatedAt)
	}

	query.Find(&certificates)

	return certificates, nil
}

func (ca *CertificateAwarded) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&CertificateAwarded{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
