package models

// FindOne returns a single puzzle by its (Lichess) id. Follows the repo
// convention of returning an empty struct (ID == "") when not found.
func (p *ChessPuzzle) FindOne(id string) (ChessPuzzle, error) {
	var puzzle ChessPuzzle
	db.First(&puzzle, "id = ?", id)

	return puzzle, nil
}

// GetNextForUser picks a random puzzle whose rating is within `band` of
// `target`, excluding puzzles the user has already WON. The band is widened a
// few times if nothing is found, then falls back to any unsolved puzzle.
func (p *ChessPuzzle) GetNextForUser(userID string, target, band int) (ChessPuzzle, error) {
	var puzzle ChessPuzzle
	excludeSolved := `id NOT IN (SELECT "chessPuzzleId" FROM chess_puzzle_rounds WHERE "userId" = ? AND win = ?)`

	for _, b := range []int{band, band * 2, band * 4, band * 8} {
		puzzle = ChessPuzzle{}
		if err := db.Where("rating BETWEEN ? AND ?", target-b, target+b).
			Where(excludeSolved, userID, true).
			Order("RANDOM()").Limit(1).Find(&puzzle).Error; err != nil {
			return puzzle, err
		}
		if puzzle.ID != "" {
			return puzzle, nil
		}
	}

	// Fallback: any unsolved puzzle regardless of rating band.
	puzzle = ChessPuzzle{}
	if err := db.Where(excludeSolved, userID, true).
		Order("RANDOM()").Limit(1).Find(&puzzle).Error; err != nil {
		return puzzle, err
	}

	return puzzle, nil
}

// IncrementNbPlays bumps the play counter for a puzzle by one.
func (p *ChessPuzzle) IncrementNbPlays(id string) error {
	return db.Exec(`UPDATE chess_puzzles SET "nbPlays" = "nbPlays" + 1 WHERE id = ?`, id).Error
}

// UpdateRating writes back a recomputed puzzle rating. Only used when puzzle
// rating writeback is enabled (disabled by default in v1).
func (p *ChessPuzzle) UpdateRating(id string, rating, rd int, volatility float64) error {
	return db.Model(&ChessPuzzle{}).Where("id = ?", id).
		Updates(map[string]interface{}{
			"rating":          rating,
			"ratingDeviation": rd,
			"volatility":      volatility,
		}).Error
}
