import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../api/chessPuzzle";
import type { TChessDifficulty, TChessPuzzleNext } from "../types/chessPuzzle";

export const useGetNextPuzzle = (
  difficulty: TChessDifficulty,
  initialPuzzleId?: string,
) => {
  // Only the very first fetch should resume a specific puzzle (e.g. from the
  // `?cpi=` URL param on page load). Cleared after a successful response so
  // any later refetch (Next puzzle / difficulty change) gets a genuinely new
  // puzzle — but kept intact across a failed attempt so react-query's
  // default retries still target the same resume id.
  const pendingPuzzleIdRef = useRef(initialPuzzleId);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["chess-next-puzzle", difficulty],
    queryFn: async () => {
      const puzzleId = pendingPuzzleIdRef.current;
      const response = await chessPuzzleAPI.getNext({ difficulty, puzzleId });
      pendingPuzzleIdRef.current = undefined;
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
