package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (sra *SatsRewardAddress) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (sra *SatsRewardAddress) Create(satsRewardAddress SatsRewardAddress) (SatsRewardAddress, error) {
	result := db.Create(&satsRewardAddress)

	if result.Error != nil {
		return satsRewardAddress, result.Error
	}
	return satsRewardAddress, nil
}

func (sra *SatsRewardAddress) FindOne(id string) (SatsRewardAddress, error) {
	var satsRewardAddress SatsRewardAddress
	db.First(&satsRewardAddress, "id = ?", id)

	return satsRewardAddress, nil
}

func (sra *SatsRewardAddress) FindByUserID(userID string) ([]SatsRewardAddress, error) {
	var satsRewardAddresses []SatsRewardAddress
	db.Find(&satsRewardAddresses, "\"userID\" = ?", userID)

	return satsRewardAddresses, nil
}

func (sra *SatsRewardAddress) FindByAddress(address string) (SatsRewardAddress, error) {
	var satsRewardAddress SatsRewardAddress
	db.First(&satsRewardAddress, "\"address\" = ?", address)

	return satsRewardAddress, nil
}

func (sra *SatsRewardAddress) FindDefaultAndVerifiedByUser(userID string) (SatsRewardAddress, error) {
	var satsRewardAddress SatsRewardAddress

	query := db.Where("\"userID\" = ? AND \"isDefault\" = ? AND \"isVerified\" = ?", userID, true, true)

	if err := query.First(&satsRewardAddress).Error; err != nil && err != gorm.ErrRecordNotFound {
		return satsRewardAddress, err
	}

	return satsRewardAddress, nil
}

func (sra *SatsRewardAddress) FindAllByUser(userID string, limit float64, cursor string) ([]SatsRewardAddress, error) {
	var satsRewardAddress []SatsRewardAddress

	query := db.Order("\"createdAt\" DESC").Where("\"userID\" = ?", userID).Limit(int(limit))

	if cursor != "" {
		var lastSatsRewardAddress SatsRewardAddress
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsRewardAddress).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsRewardAddress.CreatedAt)
	}

	if err := query.Find(&satsRewardAddress).Error; err != nil {
		return nil, err
	}

	return satsRewardAddress, nil
}

func (sra *SatsRewardAddress) FindAll(limit float64, cursor string) ([]SatsRewardAddress, error) {
	var satsRewardAddress []SatsRewardAddress

	query := db.Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSatsRewardAddress SatsRewardAddress
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsRewardAddress).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsRewardAddress.CreatedAt)
	}

	if err := query.Find(&satsRewardAddress).Error; err != nil {
		return nil, err
	}

	return satsRewardAddress, nil
}

// Update updates one SatsRewardAddress in the database, using the information
// stored in the receiver sra
func (sra *SatsRewardAddress) Update() (SatsRewardAddress, error) {
	db.Save(&sra)

	return *sra, nil
}

func (sra *SatsRewardAddress) GetTotalCount() (int64, error) {
	var count int64

	if err := db.Model(&SatsRewardAddress{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
