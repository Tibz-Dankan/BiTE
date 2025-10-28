import React from "react";
import { truncateString } from "../../../utils/truncateString";

interface PostQuestionHeadingProps {
  quizTitle: string;
}

export const PostQuestionHeading: React.FC<PostQuestionHeadingProps> = (
  props
) => {
  return (
    <div className="w-full relative mb-10s">
      {/* Decorative background gradient */}
      <div
        className="absolute inset-0 rounded-2xl opacity-10 blur-xl"
        style={{ backgroundColor: "oklch(0.749 0.154 70.67)" }}
      />

      {/* Main content */}
      <div
        className="relative bg-white rounded-2xl shadow-sm p-8 border-l-4"
        style={{ borderLeftColor: "oklch(0.749 0.154 70.67)" }}
      >
        <div className="flex items-center gap-4 mb-3">
          {/* Icon circle */}
          <div
            className="hidden w-14 h-14 rounded-full sm:flex flex-shrink-0 items-center 
            justify-center shadow-md"
            style={{ backgroundColor: "oklch(0.749 0.154 70.67)" }}
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h2
              className="text-2xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "oklch(0.749 0.154 70.67)" }}
            >
              Create Quiz Question
            </h2>
            <p className="text-gray-500 mt-1 text-[12px] sm:text-sm">
              Craft engaging questions for your learners
            </p>
          </div>
        </div>

        {/* Quiz Title */}
        <div className="flex items-center justify-start gap-2 mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Quiz:</p>
          <p className="text-lg font-semibold text-gray-800 text-start">
            {truncateString(props.quizTitle, 48)}
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex gap-2 mt-4">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "oklch(0.749 0.154 70.67)" }}
          />
          <div
            className="w-2 h-2 rounded-full opacity-60"
            style={{ backgroundColor: "oklch(0.749 0.154 70.67)" }}
          />
          <div
            className="w-2 h-2 rounded-full opacity-30"
            style={{ backgroundColor: "oklch(0.749 0.154 70.67)" }}
          />
        </div>
      </div>
    </div>
  );
};
