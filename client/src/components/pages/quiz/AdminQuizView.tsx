import { useQuery } from "@tanstack/react-query";
import React from "react";
import { quizAPI } from "../../../api/quiz";
import type { Quiz } from "../../../types/quiz";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/AlertCard";
import { QuizCard } from "../../ui/QuizCard";

export const AdminQuizView: React.FC = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["admin-quiz-view"],
    queryFn: () => quizAPI.getAll(),
  });

  const quizzes: Quiz[] = data?.data ?? [];

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
    <div className="w-full">
      <div className="w-full flex flex-col gap-4 mb-16">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="w-full">
            <QuizCard quiz={quiz} />
          </div>
        ))}
      </div>
    </div>
  );
};
