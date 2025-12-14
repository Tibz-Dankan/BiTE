import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/auth";
import { UserQuizResultCard } from "../../ui/quiz/UserQuizResultCard";
import type { TQuizAttemptData } from "../../../types/attempt";
import { Loader2 } from "lucide-react";
import { quizAPI } from "../../../api/quiz";

export const UserQuizResultPage = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const user = useAuthStore((state) => state.auth.user);
  const navigate = useNavigate();

  const {
    data: attemptData,
    isLoading,
    isError,
    error,
  } = useQuery<TQuizAttemptData>({
    queryKey: ["quizAttemptResult", quizID, user.id],
    queryFn: () => quizAPI.getQuizAttemptedData({ quizID: quizID! }),
    enabled: !!quizID && !!user.id,
  });

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
      <UserQuizResultCard attemptData={attemptData} />
    </div>
  );
};
