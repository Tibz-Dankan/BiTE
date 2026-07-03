import { useQuery } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../api/chessPuzzle";
import type { TChessDifficulty, TChessPuzzleNext } from "../types/chessPuzzle";

export const useGetNextPuzzle = (difficulty: TChessDifficulty) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["chess-next-puzzle", difficulty],
    queryFn: async () => {
      const response = await chessPuzzleAPI.getNext({ difficulty });
      return response.data;
    },
    // The puzzle should only change on an explicit refetch ("Next puzzle") or
    // when the difficulty changes — never on window refocus mid-solve.
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    // No `retry` override → uses react-query's default (3 attempts, backoff).
  });

  return {
    puzzle: (data as TChessPuzzleNext) || null,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
