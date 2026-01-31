import { useQuery } from "@tanstack/react-query";
import React from "react";
import { quizAPI } from "../../../api/quiz";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { TQuiz } from "../../../types/quiz";
import { UserQuizCard } from "./UserQuizCard";
import { AlertCard } from "../shared/AlertCard";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../stores/auth";
import type { TPagination } from "../../../types/pagination";
import { Button } from "../shared/Btn";

export const UserQuizListProgress: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const cursor = searchParams.get("qzCursor")!;
  const hasCursor: boolean = !!cursor;
  const userID = useAuthStore((state) => state.auth.user.id);
  const quizProgressStatusParam = searchParams.get("qzpStatus");
  const quizCategoryIDParam = searchParams.get("qzCategoryID");

  let quizProgressStatus = "";
  if (quizProgressStatusParam === "in_progress") {
    quizProgressStatus = "IN_PROGRESS";
  }
  if (quizProgressStatusParam === "completed") {
    quizProgressStatus = "COMPLETED";
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: [
      "user-quiz-list-progress",
      cursor ?? "",
      userID,
      quizProgressStatus ?? "",
      quizCategoryIDParam ?? "",
    ],
    queryFn: () =>
      quizAPI.getQuizzesByUserAndProgress({
        userID,
        limit: 20,
        cursor: hasCursor ? cursor : "",
        status: quizProgressStatus,
        quizCategoryID: quizCategoryIDParam ?? "",
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

  if (isPending) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
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
    <div className="space-y-12">
      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <UserQuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>

      {/* Empty State */}
      {quizzes.length === 0 && (
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

      {/* Pagination action */}
      <div className="w-full flex items-center justify-end gap-8">
        <Button
          type={"button"}
          disabled={disablePrevBtn}
          className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
           text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
          onClick={() => loadPrevQuizzesHandler()}
        >
          <div className="flex items-center justify-center gap-2 text-inherit">
            <ArrowLeft className="text-inherit w-4 h-4 text-sm -ml-2" />
            <span className="text-inherit w-4 h-4 text-[12px]">Prev</span>
          </div>
        </Button>
        <Button
          type={"button"}
          disabled={disableNextBtn}
          className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
           text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
          onClick={() => loadNextQuizzesHandler()}
        >
          <>
            {!showNextLoader && (
              <div className="flex items-center justify-center gap-2 text-inherit">
                <span className="text-inherit text-[12px]">Next</span>
                <ArrowRight className="text-inherit w-4 h-4" />
              </div>
            )}
            {showNextLoader && (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-inherit" />
                <span className="text-inherit text-[12px]">Loading...</span>
              </div>
            )}
          </>
        </Button>
      </div>
    </div>
  );
};
