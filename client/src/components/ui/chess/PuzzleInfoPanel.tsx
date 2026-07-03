import React from "react";
import { Target, Flame } from "lucide-react";
import type {
  TChessAttemptResult,
  TChessDifficulty,
  TChessPuzzleNext,
} from "../../../types/chessPuzzle";
import { DifficultySelect } from "./DifficultySelect";

interface PuzzleInfoPanelProps {
  puzzle: TChessPuzzleNext;
  result: TChessAttemptResult | null;
  displayRating: number;
  ratingDiff: number | null;
  provisional: boolean;
  difficulty: TChessDifficulty;
  onDifficultyChange: (difficulty: TChessDifficulty) => void;
}

export const PuzzleInfoPanel: React.FC<PuzzleInfoPanelProps> = ({
  puzzle,
  result,
  displayRating,
  ratingDiff,
  provisional,
  difficulty,
  onDifficultyChange,
}) => {
  const puzzleRatingRevealed = result ? result.puzzleRating.before : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Puzzle identity */}
      <div className="flex items-start gap-3">
        <Target className="w-8 h-8 text-(--primary) shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-(--foreground)">
            Puzzle #{puzzle.puzzleId}
          </p>
          <p className="text-(--muted-foreground)">
            Rating:{" "}
            {puzzleRatingRevealed !== null ? (
              <span className="font-medium text-(--foreground)">
                {puzzleRatingRevealed}
              </span>
            ) : (
              <span className="italic">hidden</span>
            )}
          </p>
          <p className="text-(--muted-foreground)">
            Played {puzzle.nbPlays.toLocaleString()} times
          </p>
        </div>
      </div>

      {/* From game */}
      {puzzle.gameUrl && (
        <a
          href={puzzle.gameUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-(--primary) hover:underline"
        >
          From the original game ↗
        </a>
      )}

      {/* Rating */}
      <div className="rounded-md border border-(--border) bg-(--card) p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-(--muted-foreground) mb-1">
          Your rating
        </p>
        <p className="text-4xl font-bold text-(--foreground)">
          {displayRating}
          {provisional ? "?" : ""}
          {ratingDiff !== null && ratingDiff !== 0 && (
            <span
              className={`ml-2 text-lg font-semibold ${
                ratingDiff > 0 ? "text-(--success)" : "text-(--error)"
              }`}
            >
              {ratingDiff > 0 ? `+${ratingDiff}` : ratingDiff}
            </span>
          )}
        </p>
      </div>

      {/* Themes */}
      {puzzle.themes.length > 0 && (
        <div className="flex items-start gap-3">
          <Flame className="w-5 h-5 text-(--primary) shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-(--foreground) mb-1">
              Puzzle Themes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {puzzle.themes.map((theme) => (
                <span
                  key={theme}
                  className="px-2 py-0.5 rounded-full bg-(--secondary) text-(--secondary-foreground) text-xs"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Difficulty */}
      <div className="text-sm">
        <label className="block font-medium text-(--foreground) mb-1">
          Difficulty level
        </label>
        <DifficultySelect value={difficulty} onChange={onDifficultyChange} />
        <p className="mt-1 text-xs text-(--muted-foreground)">
          Changing difficulty loads a new puzzle near your rating.
        </p>
      </div>
    </div>
  );
};
