import React from "react";
import type { TQuiz } from "../../../types/quiz";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { questionAPI } from "../../../api/question";
import type { TQuestion } from "../../../types/question";
import { AdminQuestionCard } from "./AdminQuestionCard";

interface AdminQuestionListProps {
  quiz: TQuiz;
}

export const AdminQuestionList: React.FC<AdminQuestionListProps> = (props) => {
  console.log("props :", props);

  const { quizID } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}-questions`],
    queryFn: () => questionAPI.getAllByQuiz({ quizID: quizID! }),
  });

  const questions: TQuestion[] = data?.data ?? {};

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
    <div className="w-full mb-16">
      {/* Search Question here  */}
      <div className="w-full flex flex-col gap-8">
        {questions.map((qtn, index) => (
          <div key={index} className="full">
            <AdminQuestionCard question={qtn} />
          </div>
        ))}
      </div>
    </div>
  );
};
