import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const UserClaimCardSkeleton: React.FC = () => {
  return (
    <div className="w-full border border-gray-400 rounded-lg bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-32" />
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="w-32 h-10 rounded-lg shrink-0" />
      </div>
    </div>
  );
};
