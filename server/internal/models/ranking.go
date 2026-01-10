package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *Ranking) BeforeCreate(tx *gorm.DB) error {
	uuid := uuid.New().String()
	tx.Statement.SetColumn("ID", uuid)
	return nil
}

func (r *Ranking) Create(ranking Ranking) (Ranking, error) {
	if err := db.Create(&ranking).Error; err != nil {
		return ranking, err
	}

	return ranking, nil
}

func (r *Ranking) FindOne(id string) (Ranking, error) {
	var ranking Ranking

	db.First(&ranking, "id = ?", id)

	return ranking, nil
}

func (r *Ranking) FindByUser(userID string) (Ranking, error) {
	var ranking Ranking

	db.Model(&Ranking{}).
		Where("\"userID\" = ?", userID).First(&ranking)

	return ranking, nil
}

// Upsert inserts or updates a ranking record for a user
func (r *Ranking) Upsert(ranking Ranking) (Ranking, error) {
	var existingRanking Ranking

	// Try to find existing ranking
	err := db.Model(&Ranking{}).
		Where("\"userID\" = ?", ranking.UserID).
		First(&existingRanking).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		return ranking, err
	}

	// If record exists, update it
	if existingRanking.ID != "" {
		existingRanking.TotalDuration = ranking.TotalDuration
		existingRanking.TotalAttempts = ranking.TotalAttempts
		existingRanking.TotalCorrectAttempts = ranking.TotalCorrectAttempts
		// Don't update rank here, it will be updated by RecalculateAllRanks

		if err := db.Save(&existingRanking).Error; err != nil {
			return existingRanking, err
		}
		return existingRanking, nil
	}

	// Otherwise, create new record
	ranking.Rank = 0 // Will be set by RecalculateAllRanks
	if err := db.Create(&ranking).Error; err != nil {
		return ranking, err
	}

	return ranking, nil
}

// RecalculateAllRanks updates the rank field for all users based on TotalCorrectAttempts (DESC) and TotalDuration (ASC)
// Higher TotalCorrectAttempts = better rank
// Lower TotalDuration = better rank (as tiebreaker)
// Rank 1 is the highest rank
func (r *Ranking) RecalculateAllRanks() error {
	var rankings []Ranking

	// Fetch all rankings ordered by correct attempts (DESC) and duration (ASC)
	if err := db.Model(&Ranking{}).
		Order("\"totalCorrectAttempts\" DESC, \"totalDuration\" ASC").
		Find(&rankings).Error; err != nil {
		return err
	}

	// Update rank for each user
	for i, ranking := range rankings {
		newRank := int64(i + 1)
		if ranking.Rank != newRank {
			if err := db.Model(&Ranking{}).
				Where("id = ?", ranking.ID).
				Update("\"rank\"", newRank).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

func (r *Ranking) Update() (Ranking, error) {
	db.Save(&r)

	return *r, nil
}

func (r *Ranking) Delete(id string) error {

	if err := db.Unscoped().Where("id = ?", id).Delete(&Ranking{}).Error; err != nil {
		return err
	}
	return nil
}

func (r *Ranking) FindAllWithUserDetails(limit int, cursor string) ([]Ranking, error) {
	var rankings []Ranking

	query := db.Model(&Ranking{}).
		Preload("User").
		Order("rank ASC").
		Limit(limit)

	if cursor != "" {
		var lastRanking Ranking
		if err := db.Select("rank").Where("id = ?", cursor).First(&lastRanking).Error; err != nil {
			return nil, err
		}
		query = query.Where("rank > ?", lastRanking.Rank)
	}

	if err := query.Find(&rankings).Error; err != nil {
		return nil, err
	}

	return rankings, nil
}
