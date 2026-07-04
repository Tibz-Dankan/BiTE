import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import type { TPagination } from "../../../types/pagination";
import { Pagination } from "../shared/Pagination";
import { AlertCard } from "../shared/AlertCard";
import { QuizCard } from "./QuizCard";
import { QuizCardSkeleton } from "./QuizCardSkeleton";

export const AdminQuizList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cursor = searchParams.get("qzCursor")!;
  const hasCursor: boolean = !!cursor;
  const quizCategoryID = searchParams.get("qzCategoryID")!;
  const hasQuizCategoryID: boolean = !!quizCategoryID;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-quiz-view-${cursor}-${quizCategoryID}`],
    queryFn: () =>
      quizAPI.getAll({
        limit: 20,
        cursor: hasCursor ? cursor : "",
        quizCategoryID: hasQuizCategoryID ? quizCategoryID : "",
      }),
  });

  const quizzes: TQuiz[] = data?.data ?? [];
  const pagination: TPagination = data?.pagination ?? {};

  const hasMoreQuizzes: boolean = pagination.hasNextItems;
  const disableNextBtn: boolean = isPending || !hasMoreQuizzes;
  const disablePrevBtn: boolean = !hasCursor;
  const showNextLoader: boolean = isPending && hasCursor;

  const loadNextQuizzesHandler = () => {
    setSearchParams(
      (prev) => {
        prev.set("qzCursor", pagination!.nextCursor);
        return prev;
      },
      { replace: false },
    );
  };

  const loadPrevQuizzesHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  if (isPending && !hasCursor) {
    return (
      <div className="w-full flex flex-col gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <QuizCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }
  return (
    <div className="w-full space-y-8">
      <div className="w-full flex flex-col gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="w-full">
            <QuizCard quiz={quiz} />
          </div>
        ))}
        {/* Empty State */}
        {quizzes.length === 0 && !isPending && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No quizzes found
            </h3>
            <p className="text-slate-600">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
      <Pagination
        disablePrev={disablePrevBtn}
        disableNext={disableNextBtn}
        onPrev={loadPrevQuizzesHandler}
        onNext={loadNextQuizzesHandler}
        isLoadingNext={showNextLoader}
      />
    </div>
  );
};
