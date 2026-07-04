import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const UserProfileCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
      <div className="w-full mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg p-2 flex flex-col items-center gap-1"
          >
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2 mt-auto">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
};
