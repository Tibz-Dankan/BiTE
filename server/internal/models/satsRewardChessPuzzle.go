package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *SatsRewardChessPuzzle) FindAllByUser(userID string, limit float64, cursor string) ([]SatsRewardChessPuzzle, error) {
	var satsRewards []SatsRewardChessPuzzle

	query := db.Model(&SatsRewardChessPuzzle{}).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "email", "\"profileBgColor\"", "\"createdAt\"", "\"updatedAt\"")
		}).
		Preload("SatsRewardAddress").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastSatsReward SatsRewardChessPuzzle
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastSatsReward).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastSatsReward.CreatedAt)
	}

	if err := query.Where("\"userID\" = ?", userID).Find(&satsRewards).Error; err != nil {
		return nil, err
	}

	return satsRewards, nil
}

func (s *SatsRewardChessPuzzle) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (s *SatsRewardChessPuzzle) Create(reward SatsRewardChessPuzzle) (SatsRewardChessPuzzle, error) {
	result := db.Create(&reward)

	if result.Error != nil {
		return reward, result.Error
	}
	return reward, nil
}

func (s *SatsRewardChessPuzzle) FindOneByUserAndPuzzle(userID string, puzzleID string) (SatsRewardChessPuzzle, error) {
	var reward SatsRewardChessPuzzle
	db.First(&reward, "\"userID\" = ? AND \"chessPuzzleID\" = ?", userID, puzzleID)

	return reward, nil
}

// Update persists the receiver's current field values (Status/Transaction/Info).
func (s *SatsRewardChessPuzzle) Update() (SatsRewardChessPuzzle, error) {
	if err := db.Save(s).Error; err != nil {
		return *s, err
	}
	return *s, nil
}
