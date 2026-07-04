import React from "react";
import { Skeleton } from "../ui/shared/Skeleton";

export const UserSiteVisitCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="h-3 w-40 mt-2" />
        </div>

        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
};
