package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (sro *SatsRewardOperation) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (sro *SatsRewardOperation) Create(satsRewardOperation SatsRewardOperation) (SatsRewardOperation, error) {
	result := db.Create(&satsRewardOperation)

	if result.Error != nil {
		return satsRewardOperation, result.Error
	}
	return satsRewardOperation, nil
}

func (sro *SatsRewardOperation) FindOne(id string) (SatsRewardOperation, error) {
	var satsRewardOperation SatsRewardOperation
	db.First(&satsRewardOperation, "id = ?", id)

	return satsRewardOperation, nil
}

func (sro *SatsRewardOperation) FindAll(limit float64, cursor string) ([]SatsRewardOperation, error) {
	var satsRewardOperation []SatsRewardOperation

	query := db.Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSatsRewardOperation SatsRewardOperation
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsRewardOperation).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsRewardOperation.CreatedAt)
	}

	if err := query.Find(&satsRewardOperation).Error; err != nil {
		return nil, err
	}

	return satsRewardOperation, nil
}

// Update updates one SatsRewardOperation in the database, using the information
// stored in the receiver sro
func (sro *SatsRewardOperation) Update() (SatsRewardOperation, error) {
	db.Save(&sro)

	return *sro, nil
}

func (sro *SatsRewardOperation) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&SatsRewardOperation{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
