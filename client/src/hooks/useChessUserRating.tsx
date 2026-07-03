import { useQuery } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../api/chessPuzzle";
import type { TChessUserRating } from "../types/chessPuzzle";

export const useChessUserRating = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["chess-user-rating"],
    queryFn: async () => {
      const response = await chessPuzzleAPI.getRating();
      return response.data;
    },
  });

  return {
    rating: (data as TChessUserRating) || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
