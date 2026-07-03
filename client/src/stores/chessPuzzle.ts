import { create } from "zustand";
import type { TChessDifficulty } from "../types/chessPuzzle";

interface ChessPuzzleState {
  difficulty: TChessDifficulty;
  showCoords: boolean;
  autoAdvance: boolean;
  setDifficulty: (difficulty: TChessDifficulty) => void;
  setShowCoords: (showCoords: boolean) => void;
  setAutoAdvance: (autoAdvance: boolean) => void;
}

// UI/client state only — puzzle and rating data live in React Query.
export const useChessPuzzleStore = create<ChessPuzzleState>((set) => ({
  difficulty: "normal",
  showCoords: true,
  autoAdvance: false,
  setDifficulty: (difficulty) => set({ difficulty }),
  setShowCoords: (showCoords) => set({ showCoords }),
  setAutoAdvance: (autoAdvance) => set({ autoAdvance }),
}));
