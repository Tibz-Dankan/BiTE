import React from "react";
import { Skeleton } from "./Skeleton";
import { FormFieldSkeleton } from "./FormFieldSkeleton";

export const HeadingFormSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-8 mt-8">
      <div className="w-full">
        <Skeleton className="h-8 w-56 mb-3" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="w-full max-w-2xl space-y-4">
        <FormFieldSkeleton />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
};
