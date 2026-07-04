import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { AlertCard } from "../../ui/shared/AlertCard";
import { UpdateQuiz } from "../../ui/quiz/UpdateQuiz";
import { UpdateQuizDates } from "../../ui/quiz/UpdateQuizDates";
import { UpdateQuizAttachment } from "../../ui/quiz/UpdateQuizAttachment";
import { UpdateQuizFormHeading } from "../../ui/quiz/UpdateQuizFormHeading";
import { Skeleton } from "../../ui/shared/Skeleton";
import { FormFieldSkeleton } from "../../ui/shared/FormFieldSkeleton";

export const AdminQuizUpdate: React.FC = () => {
  const { quizID } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const quiz: TQuiz = data?.data ?? {};

  if (isPending) {
    return (
      <div className="w-full space-y-8 mt-8">
        <Skeleton className="h-8 w-48" />
        <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
          <Skeleton className="w-full md:w-64 aspect-video rounded-lg shrink-0" />
          <div className="w-full space-y-4">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton inputHeight="h-24" />
            <FormFieldSkeleton inputHeight="h-24" />
            <div className="w-full border-t border-gray-200 pt-8 space-y-4">
              <Skeleton className="h-5 w-56" />
              <div className="flex gap-4">
                <FormFieldSkeleton />
                <FormFieldSkeleton />
              </div>
            </div>
          </div>
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
    <div className="w-full space-y-8 mt-8">
      <UpdateQuizFormHeading />
      <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
        <div className="flex items-center">
          <UpdateQuizAttachment
            quizID={quiz.id}
            attachmentID={quiz.attachments[0]?.id ?? ""}
            attachmentURL={quiz.attachments[0]?.url ?? ""}
            quizTitle={quiz.title}
          />
        </div>
        <div className="w-full space-y-8">
          <UpdateQuiz quiz={quiz} />
          <div className="w-full border-t border-gray-200 pt-8 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Update Start &amp; End Dates
            </h2>
            <UpdateQuizDates quiz={quiz} />
          </div>
        </div>
      </div>
    </div>
  );
};
