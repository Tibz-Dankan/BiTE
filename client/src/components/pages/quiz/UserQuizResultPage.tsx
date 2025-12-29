import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/auth";
import { UserQuizResultCard } from "../../ui/quiz/UserQuizResultCard";
import type { TQuizAttemptData } from "../../../types/attempt";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { quizAPI } from "../../../api/quiz";
import { Button } from "../../ui/shared/Btn";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-600 font-medium">Loading your results...</p>
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
