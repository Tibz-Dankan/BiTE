import React from "react";
import type { TChessSolverColor } from "../../../types/chessPuzzle";
import type { TPromotionRole } from "../../../hooks/usePuzzleSolver";

interface PromotionDialogProps {
  color: TChessSolverColor;
  onSelect: (role: TPromotionRole) => void;
  onCancel: () => void;
}

const GLYPHS: Record<TChessSolverColor, Record<TPromotionRole, string>> = {
  white: { q: "♕", r: "♖", b: "♗", n: "♘" },
  black: { q: "♛", r: "♜", b: "♝", n: "♞" },
};

const ROLES: { role: TPromotionRole; label: string }[] = [
  { role: "q", label: "Queen" },
  { role: "r", label: "Rook" },
  { role: "b", label: "Bishop" },
  { role: "n", label: "Knight" },
];

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  color,
  onSelect,
  onCancel,
}) => {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-md"
      onClick={onCancel}
    >
      <div
        className="bg-(--card) rounded-md p-3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-(--muted-foreground) mb-2 text-center">
          Promote to
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ROLES.map(({ role, label }) => (
            <button
              key={role}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => onSelect(role)}
              className="w-12 h-12 flex items-center justify-center text-3xl leading-none rounded-md border border-(--border) hover:bg-(--accent) transition-colors"
            >
              {GLYPHS[color][role]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
