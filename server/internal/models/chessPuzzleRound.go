package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *ChessPuzzleRound) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (r *ChessPuzzleRound) Create(round ChessPuzzleRound) (ChessPuzzleRound, error) {
	result := db.Create(&round)

	if result.Error != nil {
		return round, result.Error
	}
	return round, nil
}

func (r *ChessPuzzleRound) FindAllByUser(userID string, limit float64, cursor string) ([]ChessPuzzleRound, error) {
	var rounds []ChessPuzzleRound

	query := db.Model(&ChessPuzzleRound{}).
		Preload("ChessPuzzle").
		Order("\"createdAt\" DESC").Limit(int(limit))

	if cursor != "" {
		var lastRound ChessPuzzleRound
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastRound).Error; err != nil {
			return nil, err
		}
		query = query.Where("\"createdAt\" < ?", lastRound.CreatedAt)
	}

	if err := query.Where("\"userId\" = ?", userID).Find(&rounds).Error; err != nil {
		return nil, err
	}

	return rounds, nil
}

// HasUserWon reports whether the user has a winning round for the puzzle.
// Drives puzzle selection (won puzzles are not served again).
func (r *ChessPuzzleRound) HasUserWon(userID string, puzzleID string) (bool, error) {
	var count int64
	if err := db.Model(&ChessPuzzleRound{}).
		Where("\"userId\" = ? AND \"chessPuzzleId\" = ? AND win = ?", userID, puzzleID, true).
		Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// HasAnyRound reports whether the user has ever attempted the puzzle (win or
// loss). Used to gate the sats reward to the FIRST encounter so a
// give-up-then-resolve cannot earn sats.
func (r *ChessPuzzleRound) HasAnyRound(userID string, puzzleID string) (bool, error) {
	var count int64
	if err := db.Model(&ChessPuzzleRound{}).
		Where("\"userId\" = ? AND \"chessPuzzleId\" = ?", userID, puzzleID).
		Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// HasRewardableWin reports whether the user has a first-encounter winning round
// for the puzzle. satsEarned is only ever set above zero on such a round, so it
// alone establishes the entitlement. Guards the claim handler against a client
// claiming a puzzle it never earned.
func (r *ChessPuzzleRound) HasRewardableWin(userID string, puzzleID string) (bool, error) {
	var count int64
	if err := db.Model(&ChessPuzzleRound{}).
		Where("\"userId\" = ? AND \"chessPuzzleId\" = ? AND win = ? AND \"satsEarned\" > ?",
			userID, puzzleID, true, 0).
		Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
