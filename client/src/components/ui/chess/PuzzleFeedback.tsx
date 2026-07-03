import React from "react";
import { Crown, CheckCircle2, XCircle, Bitcoin } from "lucide-react";
import type {
  TChessAttemptResult,
  TChessSolverColor,
} from "../../../types/chessPuzzle";
import type { TSolverStatus } from "../../../hooks/usePuzzleSolver";

interface PuzzleFeedbackProps {
  status: TSolverStatus;
  result: TChessAttemptResult | null;
  solverColor: TChessSolverColor;
}

export const PuzzleFeedback: React.FC<PuzzleFeedbackProps> = ({
  status,
  result,
  solverColor,
}) => {
  if (status === "solved") {
    return (
      <div className="rounded-md border border-(--success) bg-(--success-bg) p-4">
        <div className="flex items-center gap-2 text-(--success) font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          Success!
        </div>
        {result && result.satsEarned > 0 ? (
          <p className="mt-1 flex items-center gap-1 text-sm text-(--foreground)">
            <Bitcoin className="w-4 h-4 text-(--primary)" />
            You earned {result.satsEarned} sats
          </p>
        ) : (
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Puzzle solved. No reward (already played before).
          </p>
        )}
      </div>
    );
  }

  if (status === "gaveup") {
    return (
      <div className="rounded-md border border-(--border) bg-(--muted) p-4">
        <div className="flex items-center gap-2 text-(--muted-foreground) font-semibold">
          <XCircle className="w-5 h-5" />
          Solution
        </div>
        <p className="mt-1 text-sm text-(--muted-foreground)">
          Puzzle skipped — no reward. Watch the solution play out.
        </p>
      </div>
    );
  }

  if (status === "wrong") {
    return (
      <div className="rounded-md border border-(--error) bg-(--error-bg) p-4">
        <div className="flex items-center gap-2 text-(--error) font-semibold">
          <XCircle className="w-5 h-5" />
          Not the move — try again!
        </div>
      </div>
    );
  }

  if (status === "promoting") {
    return (
      <div className="rounded-md border border-(--border) bg-(--card) p-4">
        <p className="font-semibold text-(--foreground)">
          Choose a piece to promote to.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-(--border) bg-(--card) p-4">
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-(--primary)" />
        <span className="font-semibold text-(--foreground)">Your turn</span>
      </div>
      <p className="mt-1 text-sm text-(--muted-foreground)">
        Find the best move for {solverColor}.
      </p>
    </div>
  );
};
