import React from "react";

export const UpdateQuizFormHeading: React.FC = () => {
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
            {/* Edit icon */}
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

            <h1 className="text-3xl font-bold text-white">Edit Quiz</h1>
          </div>

          {/* <p className="text-white text-center text-base opacity-95 max-w-md mx-auto">
            Update your quiz content. Modify questions, adjust answers, and
            refine your knowledge sharing.
          </p> */}

          <p className="text-white text-center text-base opacity-95 max-w-md mx-auto">
            Editing quiz details, questions, and attachments. Update the title,
            instructions, and schedule.
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
