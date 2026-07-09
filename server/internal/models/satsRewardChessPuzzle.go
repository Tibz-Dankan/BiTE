package models

import (
	"github.com/Tibz-Dankan/BiTE/internal/constants"
	"github.com/Tibz-Dankan/BiTE/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// completedPuzzleIDsForUser plucks the puzzles whose reward already reached
// COMPLETED for this user. Anything else (no row, PENDING, FAILED) stays
// claimable, so a claim doubles as a retry.
//
// Note the casing split: sats_reward_chess_puzzles uses "userID"/"chessPuzzleID"
// while chess_puzzle_rounds uses "userId"/"chessPuzzleId".
func completedPuzzleIDsForUser(userID string) ([]string, error) {
	var puzzleIDs []string
	if err := db.Model(&SatsRewardChessPuzzle{}).
		Select("\"chessPuzzleID\"").
		Where("\"userID\" = ? AND status = ?", userID, "COMPLETED").
		Pluck("\"chessPuzzleID\"", &puzzleIDs).Error; err != nil {
		return nil, err
	}
	return puzzleIDs, nil
}

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

// FindAllSatsClaimForUser lists the user's first-encounter wins whose reward has
// not been paid out yet. Rewards are normally paid automatically on solve, so
// this only surfaces puzzles won without a verified payout address on file, or
// whose payout FAILED or is stuck PENDING.
//
// The cursor is a chess_puzzle_rounds.id. Rows are returned as explicit lowercase
// keys because ChessPuzzle carries no JSON tags on its scalar fields.
//
// satsEarned reports the CURRENT reward, not the round's stored satsEarned:
// rounds won before the reward was reduced still carry the old amount, while the
// payout subscriber always sends SATS_PER_CHESS_PUZZLE_WIN. Quoting the stored
// value would promise more than the claim pays out.
func (s *SatsRewardChessPuzzle) FindAllSatsClaimForUser(limit float64, cursor string, userID string) ([]map[string]interface{}, types.Pagination, error) {
	var rounds []ChessPuzzleRound

	completedPuzzleIDs, err := completedPuzzleIDsForUser(userID)
	if err != nil {
		return nil, types.Pagination{}, err
	}

	query := db.Model(&ChessPuzzleRound{}).
		Preload("ChessPuzzle").
		Where("\"userId\" = ? AND win = ? AND \"satsEarned\" > ?", userID, true, 0).
		Order("\"createdAt\" DESC").Limit(int(limit + 1))

	if cursor != "" {
		var lastRound ChessPuzzleRound
		if err := db.Select("\"createdAt\"").Where("id = ?", cursor).First(&lastRound).Error; err != nil {
			return nil, types.Pagination{}, err
		}
		query = query.Where("\"createdAt\" < ?", lastRound.CreatedAt)
	}

	if len(completedPuzzleIDs) > 0 {
		query = query.Where("\"chessPuzzleId\" NOT IN ?", completedPuzzleIDs)
	}

	if err := query.Find(&rounds).Error; err != nil {
		return nil, types.Pagination{}, err
	}

	var nextCursor string = ""
	var hasNextItems bool = false

	if len(rounds) > int(limit) {
		rounds = rounds[:len(rounds)-1] // Remove last element
		nextCursor = rounds[len(rounds)-1].ID
		hasNextItems = true
	}

	pagination := types.Pagination{
		Limit:        int64(limit),
		NextCursor:   nextCursor,
		HasNextItems: hasNextItems,
		Count:        int64(len(rounds)),
	}

	var result []map[string]interface{}
	for _, round := range rounds {
		roundData := map[string]interface{}{
			"id":            round.ID,
			"userID":        round.UserID,
			"chessPuzzleID": round.ChessPuzzleID,
			"satsEarned":    constants.SATS_PER_CHESS_PUZZLE_WIN,
			"solvedAt":      round.CreatedAt,
			"win":           round.Win,
			"clean":         round.Clean,
		}
		if round.ChessPuzzle != nil {
			roundData["rating"] = round.ChessPuzzle.Rating
			roundData["themes"] = round.ChessPuzzle.Themes
			roundData["gameUrl"] = round.ChessPuzzle.GameUrl
		}
		result = append(result, roundData)
	}

	return result, pagination, nil
}

// SumClaimableSatsForUser totals the sats owed for wins that have not been paid
// out yet. Same selection as FindAllSatsClaimForUser, and likewise valued at the
// current reward rather than each round's stored satsEarned.
func (s *SatsRewardChessPuzzle) SumClaimableSatsForUser(userID string) (int64, error) {
	completedPuzzleIDs, err := completedPuzzleIDsForUser(userID)
	if err != nil {
		return 0, err
	}

	query := db.Model(&ChessPuzzleRound{}).
		Where("\"userId\" = ? AND win = ? AND \"satsEarned\" > ?", userID, true, 0)

	if len(completedPuzzleIDs) > 0 {
		query = query.Where("\"chessPuzzleId\" NOT IN ?", completedPuzzleIDs)
	}

	var claimableWins int64
	if err := query.Count(&claimableWins).Error; err != nil {
		return 0, err
	}

	return claimableWins * constants.SATS_PER_CHESS_PUZZLE_WIN, nil
}
