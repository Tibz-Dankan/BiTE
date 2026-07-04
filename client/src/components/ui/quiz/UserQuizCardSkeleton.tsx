import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const UserQuizCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <Skeleton className="h-2 rounded-none" />

      <div className="p-6">
        {/* Category Tag + Status */}
        <div className="w-full flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-4/5 mb-3" />

        {/* Introduction */}
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Posted By */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-36" />
        </div>

        {/* Action Button */}
        <Skeleton className="w-full h-11 rounded-xl" />
      </div>
    </div>
  );
};
