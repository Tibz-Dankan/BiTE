import React from "react";
import { Eye, ArrowRight, Loader2 } from "lucide-react";
import type { TSolverStatus } from "../../../hooks/usePuzzleSolver";

interface PuzzleControlsProps {
  status: TSolverStatus;
  submitting: boolean;
  loadingNext: boolean;
  onViewSolution: () => void;
  onNext: () => void;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  status,
  submitting,
  loadingNext,
  onViewSolution,
  onNext,
}) => {
  const finished = status === "solved" || status === "gaveup";
  const nextBusy = loadingNext || submitting;
  const canGiveUp =
    status === "waiting-user" ||
    status === "wrong" ||
    status === "checking" ||
    status === "opponent-moving" ||
    status === "promoting";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!finished && (
        <button
          type="button"
          onClick={onViewSolution}
          disabled={!canGiveUp || submitting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-(--border) text-(--foreground) hover:bg-(--accent) transition-colors disabled:opacity-50"
        >
          <Eye className="w-4 h-4" />
          View solution
        </button>
      )}

      {finished && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextBusy}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-(--primary) text-(--primary-foreground) font-medium hover:bg-(--primary-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nextBusy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          Next puzzle
        </button>
      )}
    </div>
  );
};
