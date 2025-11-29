package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (qc *QuizCategory) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (qc *QuizCategory) Create(category QuizCategory) (QuizCategory, error) {
	if err := db.Create(&category).Error; err != nil {
		return category, err
	}

	return category, nil
}

func (qc *QuizCategory) FindOne(id string) (QuizCategory, error) {
	var category QuizCategory

	db.First(&category, "id = ?", id)

	return category, nil
}

func (qc *QuizCategory) FindOneAndIncludeAttachment(id string) (QuizCategory, error) {
	var category QuizCategory

	db.Model(&QuizCategory{}).Preload("Attachments").First(&category, "id = ?", id)

	return category, nil
}

func (qc *QuizCategory) FindByName(name string) (QuizCategory, error) {
	var category QuizCategory

	db.Model(&QuizCategory{}).Preload("Attachments").First(&category, "name = ?", name)

	return category, nil
}

func (qc *QuizCategory) FindAll(limit float64, cursor string) ([]QuizCategory, error) {
	var categories []QuizCategory

	query := db.Model(&QuizCategory{}).Preload("Attachments").Limit(int(limit))

	if cursor != "" {
		var lastQuizCategory QuizCategory
		if err := db.Select("\"createdAt\"").Where("id = ?",
			cursor).First(&lastQuizCategory).Error; err != nil {
			return categories, err
		}
		query = query.Where("\"createdAt\" < ?", lastQuizCategory.CreatedAt)
	}

	query.Find(&categories)

	return categories, nil
}

func (a *QuizCategory) Update() (QuizCategory, error) {
	db.Save(&a)

	return *a, nil
}

func (a *QuizCategory) Delete(id string) error {
	if err := db.Unscoped().Where("id = ?", id).Delete(&QuizCategory{}).Error; err != nil {
		return err
	}
	return nil
}
