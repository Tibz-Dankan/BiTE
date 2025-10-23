import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { UpdateQuiz } from "../../ui/quiz/UpdateQuiz";
import { UpdateQuizAttachment } from "../../ui/quiz/UpdateQuizAttachment";

export const AdminQuizUpdate: React.FC = () => {
  const { quizID } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const quiz: TQuiz = data?.data ?? {};

  console.log("quiz: ", quiz);

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
      <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
        <div className="flex items-center">
          <UpdateQuizAttachment
            quizID={quiz.id}
            attachmentID={quiz.attachments[0]?.id ?? ""}
            attachmentURL={quiz.attachments[0]?.url ?? ""}
            quizTitle={quiz.title}
          />
        </div>
        <div className="w-full">
          <UpdateQuiz quiz={quiz} />
        </div>
      </div>
    </div>
  );
};
