import React from "react";
import { Skeleton } from "./Skeleton";

interface FormFieldSkeletonProps {
  inputHeight?: string;
}

export const FormFieldSkeleton: React.FC<FormFieldSkeletonProps> = ({
  inputHeight = "h-9",
}) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 mb-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className={`w-full ${inputHeight}`} />
    </div>
  );
};
