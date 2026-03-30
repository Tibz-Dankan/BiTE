package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (cc *CategoryCertificate) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (cc *CategoryCertificate) Create(certificate CategoryCertificate) (CategoryCertificate, error) {
	if err := db.Create(&certificate).Error; err != nil {
		return certificate, err
	}

	return certificate, nil
}

func (cc *CategoryCertificate) FindOne(id string) (CategoryCertificate, error) {
	var certificate CategoryCertificate

	db.First(&certificate, "id = ?", id)

	return certificate, nil
}

func (cc *CategoryCertificate) FindOneWithQuizzes(id string) (CategoryCertificate, error) {
	var certificate CategoryCertificate

	db.Model(&CategoryCertificate{}).
		Preload("QuizCategory").
		Preload("CategoryCertificateQuizzes.Quiz").
		Preload("CategoryCertificateQuizzes.Quiz.Attachments").
		First(&certificate, "id = ?", id)

	return certificate, nil
}

func (cc *CategoryCertificate) FindByQuizCategoryID(quizCategoryID string) (CategoryCertificate, error) {
	var certificate CategoryCertificate

	db.Model(&CategoryCertificate{}).
		Where("\"quizCategoryID\" = ?", quizCategoryID).
		First(&certificate)

	return certificate, nil
}

func (cc *CategoryCertificate) FindAll(limit float64, cursor string) ([]CategoryCertificate, error) {
	var certificates []CategoryCertificate

	query := db.Model(&CategoryCertificate{}).
		Preload("QuizCategory").
		Preload("CategoryCertificateQuizzes.Quiz").
		Preload("CategoryCertificateQuizzes.Quiz.Attachments").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastCertificate CategoryCertificate
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastCertificate).Error; err != nil {
			return certificates, err
		}
		query = query.Where("\"createdAt\" < ?", lastCertificate.CreatedAt)
	}

	query.Find(&certificates)

	return certificates, nil
}

func (cc *CategoryCertificate) Update() (CategoryCertificate, error) {
	db.Save(&cc)

	return *cc, nil
}

func (cc *CategoryCertificate) Delete(id string) error {
	ccq := CategoryCertificateQuizzes{}
	if err := ccq.DeleteByCertificate(id); err != nil {
		return err
	}

	if err := db.Unscoped().Where("id = ?", id).Delete(&CategoryCertificate{}).Error; err != nil {
		return err
	}
	return nil
}
