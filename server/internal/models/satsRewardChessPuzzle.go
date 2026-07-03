package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

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
