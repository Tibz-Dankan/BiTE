import React from "react";
import { Skeleton } from "../ui/shared/Skeleton";

export const UserRankingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="h-3 w-40 mt-3" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
          ))}
        </div>

        <div className="border-t border-gray-50 pt-3">
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
  );
};
