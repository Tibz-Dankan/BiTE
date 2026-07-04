import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";
import { UserQuestionCard } from "../../ui/question/UserQuestionCard";
import type { TQuizAttemptData } from "../../../types/attempt";
// import { QuizAttemptProgressBar } from "../../ui/quiz/QuizAttemptProgressBar";

import { useQuizAttemptStore } from "../../../stores/quizAttempt";
import { Skeleton } from "../../ui/shared/Skeleton";

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

  const setQuizAttempt = useQuizAttemptStore((state) => state.setQuizAttempt);

  React.useEffect(() => {
    if (quizAttemptData) {
      setQuizAttempt(quizAttemptData);
    }
  }, [quizAttemptData, setQuizAttempt]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-0 sm:px-4 py-4 space-y-8">
        <div
          className="w-full space-y-6 border border-gray-200 shadow-sm
          p-6 sm:p-8 rounded-2xl bg-white relative overflow-hidden"
        >
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="w-full flex flex-col md:flex-row items-stretch gap-6">
              <Skeleton className="w-full md:w-72 aspect-video md:aspect-[4/3] rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col justify-center gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="w-full flex flex-col sm:flex-row items-start justify-center gap-4">
              <Skeleton className="w-full sm:w-80 min-h-32 rounded-md" />
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>

          <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
        </div>
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
    <div className="w-full max-w-4xl mx-auto px-0 sm:px-4 py-4 space-y-8">
      {/* <QuizAttemptProgressBar quizProgress={quizAttemptData.progress} /> */}
      <UserQuestionCard
        quizData={quizAttemptData.data}
        question={currentQuestion}
        quizID={quizID!}
        pagination={quizAttemptData.pagination}
      />
    </div>
  );
};
