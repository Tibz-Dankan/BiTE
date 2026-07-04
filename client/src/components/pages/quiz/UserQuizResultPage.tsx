import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/auth";
import { UserQuizResultCard } from "../../ui/quiz/UserQuizResultCard";
import type { TQuizAttemptData } from "../../../types/attempt";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { quizAPI } from "../../../api/quiz";
import { Button } from "../../ui/shared/Btn";
import { Skeleton } from "../../ui/shared/Skeleton";

export const UserQuizResultPage = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const user = useAuthStore((state) => state.auth.user);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cursor = searchParams.get("qtnCursor")!;
  const hasCursor: boolean = !!cursor;

  const {
    data: attemptData,
    isLoading,
    isError,
    error,
  } = useQuery<TQuizAttemptData>({
    queryKey: ["quizAttemptResult", quizID, user.id, cursor],
    queryFn: () =>
      quizAPI.getQuizAttemptedData({
        quizID: quizID!,
        limit: 20,
        questionCursor: hasCursor ? cursor : "",
      }),
    enabled: !!quizID && !!user.id,
  });

  const pagination = attemptData?.pagination;
  const hasMoreQuizzes: boolean = pagination?.hasNextItems || false;
  const disableNextBtn: boolean = !hasMoreQuizzes;
  const disablePrevBtn: boolean = !hasCursor;
  const showNextLoader: boolean = isLoading && hasCursor;

  const loadNextQuizzesHandler = () => {
    setSearchParams(
      (prev) => {
        prev.set("qtnCursor", pagination!.nextCursor);
        return prev;
      },
      { replace: false }
    );
  };

  const loadPrevQuizzesHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto pb-12">
          <Skeleton className="h-5 w-36 mb-6" />

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="bg-(--muted) p-8">
              <Skeleton className="h-8 w-2/3 mb-3" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-3"
                >
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-7 w-48 mx-2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3"
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          {/* Error icon or similar */}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Unable to Load Results
        </h3>
        <p className="text-slate-500 max-w-md mb-6">
          {(error as Error).message ||
            "We couldn't fetch your quiz results. Please try again later."}
        </p>
        <button
          onClick={() => navigate("/u/quizzes")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          Return to Quizzes
        </button>
      </div>
    );
  }

  if (!attemptData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Results */}
      <UserQuizResultCard attemptData={attemptData} />
      {/* Pagination */}
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
