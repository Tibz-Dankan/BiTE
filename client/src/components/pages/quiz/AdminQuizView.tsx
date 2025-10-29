import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { QuizCard } from "../../ui/quiz/QuizCard";
import type { TPagination } from "../../../types/pagination";
import { Button } from "../../ui/shared/Btn";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AdminQuizView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cursor = searchParams.get("qzCursor")!;
  const hasCursor: boolean = !!cursor;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-quiz-view-${cursor}`],
    queryFn: () =>
      quizAPI.getAll({ limit: 20, cursor: hasCursor ? cursor : "" }),
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
      { replace: false }
    );
  };

  const loadPrevQuizzesHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  useEffect(() => {
    const updateQuizzesInStore = () => {
      //  update actins here
      // setPagination(() => data?.pagination ?? {});
    };
    updateQuizzesInStore();
  }, [data]);

  if (isPending) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  return (
    <div className="w-full mt-4 mb-16 space-y-8">
      <div className="w-full flex flex-col gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="w-full">
            <QuizCard quiz={quiz} />
          </div>
        ))}
      </div>
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
