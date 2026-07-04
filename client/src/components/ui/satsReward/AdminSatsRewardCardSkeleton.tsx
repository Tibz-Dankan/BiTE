import React from "react";
import { Skeleton } from "../shared/Skeleton";

export const AdminSatsRewardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
