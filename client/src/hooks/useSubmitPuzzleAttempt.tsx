import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../api/chessPuzzle";
import type {
  TChessAttemptResult,
  TChessSubmitAttemptInput,
} from "../types/chessPuzzle";

export const useSubmitPuzzleAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: TChessSubmitAttemptInput,
    ): Promise<TChessAttemptResult> => {
      const response = await chessPuzzleAPI.submitAttempt(input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chess-user-rating"] });
    },
  });
};
