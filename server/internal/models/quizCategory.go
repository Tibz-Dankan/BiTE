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

func (qc *QuizCategory) FindByName(name string) (QuizCategory, error) {
	var category QuizCategory

	// if err := db.First(&category, "name = ?", name).Error; err != nil {
	// 	return category, err
	// }
	db.First(&category, "name = ?", name)

	return category, nil
}

func (qc *QuizCategory) FindAll() (QuizCategory, error) {
	var category QuizCategory

	if err := db.Find(&category).Error; err != nil {
		return category, err
	}

	return category, nil
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
