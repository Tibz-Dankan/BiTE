import { create } from "zustand";
import type { TQuizAttemptData } from "../types/attempt";

interface QuizAttemptState {
  data: TQuizAttemptData | null;
  setQuizAttempt: (data: TQuizAttemptData) => void;
  updateProgressStatus: (status: "IN_PROGRESS" | "COMPLETED") => void;
  clearQuizAttempt: () => void;
}

export const useQuizAttemptStore = create<QuizAttemptState>((set) => ({
  data: null,
  setQuizAttempt: (data) => set({ data }),
  updateProgressStatus: (status) =>
    set((state) => {
      if (!state.data) return {};
      return {
        data: {
          ...state.data,
          progress: {
            ...state.data.progress,
            status,
          },
        },
      };
    }),
  clearQuizAttempt: () => set({ data: null }),
}));
