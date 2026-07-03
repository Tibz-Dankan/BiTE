package models

import (
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (ur *ChessUserPuzzleRating) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (ur *ChessUserPuzzleRating) FindByUser(userID string) (ChessUserPuzzleRating, error) {
	var rating ChessUserPuzzleRating
	db.First(&rating, "\"userId\" = ?", userID)

	return rating, nil
}

// FindOrCreateByUser returns the user's puzzle rating, creating it at the
// canonical Glicko-2 starting values (1500 / 500 / 0.09) on first use.
func (ur *ChessUserPuzzleRating) FindOrCreateByUser(userID string) (ChessUserPuzzleRating, error) {
	var rating ChessUserPuzzleRating

	err := db.Where("\"userId\" = ?", userID).First(&rating).Error
	if err == nil {
		return rating, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return rating, err
	}

	rating = ChessUserPuzzleRating{
		UserID:          userID,
		Rating:          1500,
		RatingDeviation: 500,
		Volatility:      0.09,
		GamesPlayed:     0,
	}
	if err := db.Create(&rating).Error; err != nil {
		return rating, err
	}

	return rating, nil
}

// Update persists the receiver's current field values.
func (ur *ChessUserPuzzleRating) Update() (ChessUserPuzzleRating, error) {
	if err := db.Save(ur).Error; err != nil {
		return *ur, err
	}
	return *ur, nil
}
