import { useQuery } from "@tanstack/react-query";
import React from "react";
import { quizAPI } from "../../../api/quiz";
import type { TQuizAnalytics } from "../../../types/quiz";
import { addCommasToNumber } from "../../../utils/addCommasToNumber";
import { Loader2, FileText, HelpCircle, MessageSquare } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { Card } from "../shared/Card";

export const QuizAnalytics: React.FC = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["quiz-analytics"],
    queryFn: () => quizAPI.getAnalytics(),
  });

  const QuizAnalytics: TQuizAnalytics = data?.data ?? {
    count: { answers: 0, questions: 0, quizzes: 0 },
  };

  const getValue = (valueInt: number) => {
    if (valueInt === 0) return "None";
    return addCommasToNumber(valueInt);
  };

  if (isPending) {
    return (
      <div className="w-full  h-[20vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full  h-[20vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row items-start justify-start gap-4
      [&>*]:min-h-32 [&>*]:min-w-56 [&>*]:shadow-md w-full"
    >
      <Card
        className="flex flex-col justify-between gap-4 w-full
        border-[1px] border-gray-300 shadow-none"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-500">Total Number of Quizzes</p>
          <span
            className="text-color-text-primary bg-(--primary)/15
            rounded-md p-2"
          >
            <FileText className="text-primary w-5 h-5 text-(--primary)" />
          </span>
        </div>
        <div className="flex flex-col gap-2 text-gray-800">
          <p className="font-semibold text-3xl">
            {getValue(QuizAnalytics.count.quizzes)}
          </p>
        </div>
      </Card>
      <Card
        className="flex flex-col justify-between gap-4 w-full
        border-[1px] border-gray-300"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-500">All questions</p>
          <span
            className="text-color-text-primary bg-(--primary)/15
            rounded-md p-2"
          >
            <HelpCircle className="text-lg text-primary w-5 h-5 text-(--primary)" />
          </span>
        </div>
        <div className="flex flex-col gap-2 text-gray-800">
          <p className="font-semibold text-3xl">
            {getValue(QuizAnalytics.count.questions)}
          </p>
        </div>
      </Card>
      <Card
        className="flex flex-col justify-between gap-4 w-full
        border-[1px] border-gray-300"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-500">Number of Answers</p>
          <span
            className="text-color-text-primary bg-(--primary)/15
            rounded-md p-2"
          >
            <MessageSquare className="text-primary w-5 h-5 text-(--primary)" />
          </span>
        </div>
        <div className="flex flex-col gap-2 text-gray-800">
          <p className="font-semibold text-3xl">
            {getValue(QuizAnalytics.count.answers)}
          </p>
        </div>
      </Card>
    </div>
  );
};
