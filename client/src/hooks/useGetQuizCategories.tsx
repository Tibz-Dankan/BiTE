import { useQuery } from "@tanstack/react-query";
import { quizCategoryAPI } from "../api/quizCategory";
import type { TGetAllQuizCategoriesResponse } from "../types/quizCategory";

export const useGetQuizCategories = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: async () => {
      const response: TGetAllQuizCategoriesResponse =
        await quizCategoryAPI.getAll({
          limit: 25,
          cursor: "",
        });
      return response.data;
    },
  });

  return {
    quizCategories: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
