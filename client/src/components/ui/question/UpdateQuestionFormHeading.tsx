import React from "react";
// import { truncateString } from "../../../utils/truncateString";
// import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { QuillViewer } from "../shared/QuillViewer";

interface UpdateQuestionHeadingProps {
  quizTitleDelta: string;
}

export const UpdateQuestionFormHeading: React.FC<UpdateQuestionHeadingProps> = (
  props
) => {
  const quizTitleDelta = props.quizTitleDelta;

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
            className="hidden w-14 h-14 rounded-full sm:flex items-center 
            justify-center shadow-md"
            style={{ backgroundColor: "oklch(0.749 0.154 70.67)" }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h2
              className="text-2xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "oklch(0.749 0.154 70.67)" }}
            >
              Edit Question
            </h2>
            <p className="text-gray-500 mt-1 text-[12px] sm:text-sm">
              Editing question details i.e title, number and attachments.
            </p>
          </div>
        </div>

        {/* Quiz Title */}
        <div
          className="flex items-center justify-start gap-2 mt-6 pt-4 border-t
          border-gray-200"
        >
          <p className="text-sm text-gray-600">Quiz:</p>
          {/* <p className="text-lg font-semibold text-gray-800 text-start">
            {truncateString(props.quizTitle, 48)}
          </p> */}
          <QuillViewer deltaContent={quizTitleDelta} />
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
