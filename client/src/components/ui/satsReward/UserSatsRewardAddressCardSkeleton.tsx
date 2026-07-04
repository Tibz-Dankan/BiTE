import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const UserSatsRewardAddressCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-slate-100 p-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="w-full flex items-center gap-4 bg-slate-50 p-4 rounded-xl mb-4">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
};
