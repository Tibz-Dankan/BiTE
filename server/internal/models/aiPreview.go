package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (ap *AIPreview) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (ap *AIPreview) Create(aiPreview AIPreview) (AIPreview, error) {
	if err := db.Create(&aiPreview).Error; err != nil {
		return aiPreview, err
	}

	return aiPreview, nil
}

func (ap *AIPreview) FindOne(id string) (AIPreview, error) {
	var aiPreview AIPreview

	db.First(&aiPreview, "id = ?", id)

	return aiPreview, nil
}

func (ap *AIPreview) FindByQuestionID(questionID string) ([]AIPreview, error) {
	var aiPreviews []AIPreview

	if err := db.Model(&AIPreview{}).
		Where("\"questionID\" = ?", questionID).
		Order("\"createdAt\" DESC").
		Find(&aiPreviews).Error; err != nil {
		return aiPreviews, err
	}

	return aiPreviews, nil
}

func (ap *AIPreview) FindDefaultByQuestionID(questionID string) (AIPreview, error) {
	var aiPreview AIPreview

	if err := db.Where("\"questionID\" = ? AND \"isDefault\" = ?", questionID, true).
		First(&aiPreview).Error; err != nil && err != gorm.ErrRecordNotFound {
		return aiPreview, err
	}

	return aiPreview, nil
}

func (ap *AIPreview) Update() (AIPreview, error) {
	db.Save(&ap)

	return *ap, nil
}

func (ap *AIPreview) Delete(id string) error {
	if err := db.Unscoped().Where("id = ?", id).Delete(&AIPreview{}).Error; err != nil {
		return err
	}
	return nil
}

// RemoveDefaultByQuestion sets isDefault to false for all AIPreview records belonging to a question
func (ap *AIPreview) RemoveDefaultByQuestion(questionID string) error {
	return db.Model(&AIPreview{}).
		Where("\"questionID\" = ? AND \"isDefault\" = ?", questionID, true).
		Update("isDefault", false).Error
}
