import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const QuizCardSkeleton: React.FC = () => {
  return (
    <div
      className="w-full border-[1px] border-gray-300 rounded-lg
      flex flex-col sm:flex-row items-center bg-gray-800/5"
    >
      <div className="w-full p-6 pb-0 sm:p-0 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
        <Skeleton className="w-full h-full aspect-[2/1] sm:aspect-auto rounded-lg sm:rounded-none sm:rounded-l-lg" />
      </div>
      <div className="w-full px-6 pb-4 sm:pb-0 flex flex-1 flex-col justify-between gap-3 h-full p-3">
        <Skeleton className="h-3 w-40" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton className="hidden sm:block h-20 w-2 rounded-none rounded-r-lg shrink-0" />
    </div>
  );
};
