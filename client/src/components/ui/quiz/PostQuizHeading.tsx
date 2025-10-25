import React from "react";

export const QuizFormHeading: React.FC = () => {
  return (
    <div className="w-full mx-auto">
      {/* Gradient background card */}
      <div
        className="w-full rounded-2xl p-8 shadow-sm relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, oklch(0.749 0.154 70.67) 0%, oklch(0.849 0.154 70.67) 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 -mr-20 -mt-20"
          style={{ backgroundColor: "white" }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-20 -ml-16 -mb-16"
          style={{ backgroundColor: "white" }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Quiz icon */}
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <h1 className="text-3xl font-bold text-white">Post a Quiz</h1>
          </div>

          <p className="text-white text-center text-base opacity-95 max-w-md mx-auto">
            Create an engaging quiz for your audience. Add questions, set
            answers, and share your knowledge.
          </p>

          {/* Decorative line */}
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-white rounded-full opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};
