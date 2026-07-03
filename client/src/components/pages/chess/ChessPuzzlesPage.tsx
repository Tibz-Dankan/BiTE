import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";

import { usePuzzleSolver } from "../../../hooks/usePuzzleSolver";
import { useChessPuzzleStore } from "../../../stores/chessPuzzle";
import { unlockAudio } from "../../../utils/chessSound";

import { Chessboard } from "../../ui/chess/Chessboard";
import { PromotionDialog } from "../../ui/chess/PromotionDialog";
import { PuzzleInfoPanel } from "../../ui/chess/PuzzleInfoPanel";
import { MoveList } from "../../ui/chess/MoveList";
import { PuzzleFeedback } from "../../ui/chess/PuzzleFeedback";
import { PuzzleControls } from "../../ui/chess/PuzzleControls";
import { ViewSolutionModal } from "../../ui/chess/ViewSolutionModal";
import { useFeatureFlagEnabled } from "@posthog/react";

const fireConfetti = () => {
  const duration = 1500;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = window.setInterval(() => {
    const left = end - Date.now();
    if (left <= 0) {
      window.clearInterval(interval);
      return;
    }
    const particleCount = 50 * (left / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

export const ChessPuzzlesPage: React.FC = () => {
  const difficulty = useChessPuzzleStore((s) => s.difficulty);
  const setDifficulty = useChessPuzzleStore((s) => s.setDifficulty);
  const showCoords = useChessPuzzleStore((s) => s.showCoords);

  const [confirmViewSolution, setConfirmViewSolution] = useState(false);

  const {
    board,
    status,
    result,
    sanHistory,
    pendingPromotion,
    puzzle,
    isLoading,
    isFetching,
    isError,
    error,
    submitting,
    onBoardMove,
    choosePromotion,
    cancelPromotion,
    giveUp,
    loadNext,
  } = usePuzzleSolver();

  // Celebrate a solve.
  useEffect(() => {
    if (status === "solved") fireConfetti();
  }, [status]);

  const displayRating =
    result?.userRating.after ?? puzzle?.userRating.rating ?? 1500;
  const ratingDiff = result?.userRating.diff ?? null;
  const provisional =
    result?.userRating.provisional ?? puzzle?.userRating.provisional ?? true;

  const flagEnabled = useFeatureFlagEnabled("chesspuzzle");

  if (!flagEnabled) {
    return <div>Chess Puzzles coming soon!</div>;
  }

  return (
    <div
      className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4"
      onPointerDown={() => unlockAudio()}
    >
      <h1 className="text-2xl font-bold text-(--foreground) mb-4">
        Chess Puzzles
      </h1>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-(--primary)" />
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <p className="text-(--error)">
            {error instanceof Error ? error.message : "Failed to load puzzle"}
          </p>
          <button
            type="button"
            onClick={() => loadNext()}
            className="px-4 py-2 rounded-md bg-(--primary) text-(--primary-foreground)"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && puzzle && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-6 lg:items-start">
            {/* Left rail */}
            <aside className="order-2 lg:order-1">
              <PuzzleInfoPanel
                puzzle={puzzle}
                result={result}
                displayRating={displayRating}
                ratingDiff={ratingDiff}
                provisional={provisional}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
              />
            </aside>

            {/* Board */}
            <main className="order-1 lg:order-2">
              <div className="relative">
                <Chessboard
                  fen={board.fen}
                  orientation={board.orientation}
                  turnColor={board.turnColor}
                  movableColor={board.movableColor}
                  dests={board.dests}
                  lastMove={board.lastMove}
                  viewOnly={board.viewOnly}
                  showCoords={showCoords}
                  syncKey={board.v}
                  onMove={onBoardMove}
                />
                {pendingPromotion && (
                  <PromotionDialog
                    color={board.movableColor}
                    onSelect={choosePromotion}
                    onCancel={cancelPromotion}
                  />
                )}
              </div>
            </main>

            {/* Right rail */}
            <aside className="order-3 flex flex-col gap-4">
              <MoveList startFen={puzzle.fen} sanHistory={sanHistory} />
              <PuzzleFeedback
                status={status}
                result={result}
                solverColor={puzzle.solverColor}
              />
              <PuzzleControls
                status={status}
                submitting={submitting}
                loadingNext={isFetching}
                onViewSolution={() => setConfirmViewSolution(true)}
                onNext={loadNext}
              />
            </aside>
          </div>

          <ViewSolutionModal
            isOpen={confirmViewSolution}
            puzzleId={puzzle.puzzleId}
            onClose={() => setConfirmViewSolution(false)}
            onConfirm={() => {
              setConfirmViewSolution(false);
              void giveUp();
            }}
          />
        </>
      )}
    </div>
  );
};
