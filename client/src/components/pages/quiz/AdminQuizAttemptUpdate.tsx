import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { AlertCard } from "../../ui/shared/AlertCard";
import { UpdateQuizAttemptForm } from "../../ui/quiz/UpdateQuizAttemptForm";
import { HeadingFormSkeleton } from "../../ui/shared/HeadingFormSkeleton";

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
    return <HeadingFormSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 mt-8">
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
