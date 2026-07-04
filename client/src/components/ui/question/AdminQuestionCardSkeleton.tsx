import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const AdminQuestionCardSkeleton: React.FC = () => {
  return (
    <div
      className="w-full space-y-6 border border-gray-200 shadow-sm
      p-6 sm:p-8 rounded-2xl bg-white"
    >
      <div className="w-full flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <div className="w-full flex flex-col sm:flex-row items-start justify-center gap-4">
        <Skeleton className="w-full sm:w-80 min-h-32 rounded-md" />
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
};
