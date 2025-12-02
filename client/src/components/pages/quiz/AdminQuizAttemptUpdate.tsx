import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { UpdateQuizAttemptForm } from "../../ui/quiz/UpdateQuizAttemptForm";

export const AdminQuizAttemptUpdate: React.FC = () => {
  const { quizID } = useParams();

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const quiz: TQuiz = data?.data ?? {};

  const handleSuccess = async (succeeded: boolean) => {
    if (succeeded) {
      // Refetch quiz data to update the UI with new attemptability status
      await refetch();
    }
  };

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
    <div className="w-full mb-16 space-y-8 mt-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Quiz Attemptability
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Control whether students can attempt this quiz: {quiz.title}
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <UpdateQuizAttemptForm quiz={quiz} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};
