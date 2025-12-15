import React from "react";
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

  // Create an array of length totalQuestions to map over
  const bars = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className="flex w-full gap-1">
      {bars.map((index) => {
        // active if the bar index (0-based) is less than currentQuestionNumber
        // e.g. if currentQuestionNumber is 1, index 0 is active.
        const isActive = index < currentQuestionNumber;

        return (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full bg-(--primary) transition-all duration-300 ${
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
  );
};
