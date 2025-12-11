import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { quizAPI } from "../../../api/quiz";
import { UserQuestionCard } from "../../ui/question/UserQuestionCard";
import type { TQuizAttemptData } from "../../../types/attempt";

export const UserQuizAttempt: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const [searchParams] = useSearchParams();

  const limit = parseInt(searchParams.get("limit") || "1");
  const questionCursor = searchParams.get("cursor") || "";

  const {
    data: quizAttemptData,
    isLoading,
    isError,
    error,
  } = useQuery<TQuizAttemptData>({
    queryKey: ["quizAttempt", quizID, limit, questionCursor],
    queryFn: () =>
      quizAPI.getQuizDataForAttempt({
        quizID: quizID!,
        limit,
        questionCursor,
      }),
    enabled: !!quizID,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-(--primary)" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">
          Error: {error?.message || "Failed to load quiz"}
        </p>
      </div>
    );
  }

  const currentQuestion = quizAttemptData?.data?.questions?.[0];

  if (!quizAttemptData?.data || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">No question available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <UserQuestionCard
        quizData={quizAttemptData.data}
        question={currentQuestion}
        quizID={quizID!}
        pagination={quizAttemptData.pagination}
      />
    </div>
  );
};
