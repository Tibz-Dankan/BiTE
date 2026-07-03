package main

import (
	"github.com/Tibz-Dankan/BiTE/internal/handlers/chesspuzzle"
)

// Seeds the chess_puzzles table from the Lichess CSV.
// Run from the server/ directory:
//
//	GO_ENV=development go run cmd/seed/main.go
//
// Idempotent (ON CONFLICT DO NOTHING) — safe to re-run. The chess_puzzles
// table must already exist (created by the app's AutoMigrate on first boot).
func main() {
	chesspuzzle.ChessPuzzleSeeder()
}
