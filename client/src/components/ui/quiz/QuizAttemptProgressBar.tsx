import React, { useState } from "react";
import type { TQuizAttemptData } from "../../../types/attempt";

interface QuizAttemptProgressBarProps {
  quizProgress: TQuizAttemptData["progress"];
}

export const QuizAttemptProgressBar: React.FC<QuizAttemptProgressBarProps> = ({
  quizProgress,
}) => {
  const totalQuestions = quizProgress.totalQuestions || 0;
  // Increment totalAttemptedQuestions by one to show current progress (1-based for the user)
  // If totalAttemptedQuestions is 0, we are on question 1.
  const currentQuestionNumber = (quizProgress.totalAttemptedQuestions || 0) + 1;

  const [isQuizCompleted] = useState(false);

  // Create an array of length totalQuestions to map over
  const bars = Array.from({ length: totalQuestions }, (_, i) => i);

  if (isQuizCompleted) {
    return null;
  }

  return (
    <div
      className="w-full flex flex-col items-center bg-white gap-2
       p-4 pt-3 rounded-md border border-slate-300"
    >
      <div className="w-full flex items-center justify-between gap-2">
        <div>
          <span className="text-sm text-gray-700">Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">{currentQuestionNumber}</span>
          <span className="text-sm text-gray-700">/</span>
          <span className="text-sm text-gray-700">{totalQuestions}</span>
        </div>
      </div>
      <div className="w-full flex items-center gap-1">
        {bars.map((index) => {
          // active if the bar index (0-based) is less than currentQuestionNumber
          // e.g. if currentQuestionNumber is 1, index 0 is active.
          const isActive = index < currentQuestionNumber;

          return (
            <div
              className={`h-2 flex-1 rounded-full bg-(--primary) transition-all duration-300 z-10 ${
                isActive ? "" : "opacity-30"
              }`}
              aria-label={
                isActive
                  ? `Question ${index + 1} completed or in progress`
                  : `Question ${index + 1} pending`
              }
            />
          );
        })}
      </div>
    </div>
  );
};
