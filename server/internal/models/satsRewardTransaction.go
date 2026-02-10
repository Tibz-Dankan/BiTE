package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (srt *SatsRewardTransaction) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (srt *SatsRewardTransaction) Create(satsRewardTransaction SatsRewardTransaction) (SatsRewardTransaction, error) {
	result := db.Create(&satsRewardTransaction)

	if result.Error != nil {
		return satsRewardTransaction, result.Error
	}
	return satsRewardTransaction, nil
}

func (srt *SatsRewardTransaction) FindOne(id string) (SatsRewardTransaction, error) {
	var satsRewardTransaction SatsRewardTransaction
	db.First(&satsRewardTransaction, "id = ?", id)

	return satsRewardTransaction, nil
}

func (srt *SatsRewardTransaction) FindAll(limit float64, cursor string) ([]SatsRewardTransaction, error) {
	var satsRewardTransactions []SatsRewardTransaction

	query := db.Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSatsRewardTransaction SatsRewardTransaction
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsRewardTransaction).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsRewardTransaction.CreatedAt)
	}

	if err := query.Find(&satsRewardTransactions).Error; err != nil {
		return nil, err
	}

	return satsRewardTransactions, nil
}

// Update updates one SatsRewardTransaction in the database, using the information
// stored in the receiver srt
func (srt *SatsRewardTransaction) Update() (SatsRewardTransaction, error) {
	db.Save(&srt)

	return *srt, nil
}

func (srt *SatsRewardTransaction) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&SatsRewardTransaction{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
