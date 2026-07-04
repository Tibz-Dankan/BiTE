import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { AlertCard } from "../../ui/shared/AlertCard";
import { PostQuestion } from "../../ui/question/PostQuestion";
import { Skeleton } from "../../ui/shared/Skeleton";
import { FormFieldSkeleton } from "../../ui/shared/FormFieldSkeleton";

export const AdminPostQuestion: React.FC = () => {
  const { quizID } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const quiz: TQuiz = data?.data ?? {};

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center mt-8">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-7 w-48" />
          <FormFieldSkeleton inputHeight="h-24" />
          <FormFieldSkeleton inputHeight="h-24" />
          <FormFieldSkeleton />
          <Skeleton className="h-10 w-32 rounded-md" />
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
    <div className="w-full flex items-center justify-center mt-8">
      <PostQuestion quiz={quiz} />
    </div>
  );
};
