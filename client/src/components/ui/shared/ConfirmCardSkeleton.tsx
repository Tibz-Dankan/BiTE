import React from "react";
import { Skeleton } from "./Skeleton";

export const ConfirmCardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full rounded-md" />
        <div className="flex items-center justify-end gap-3 mt-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};
