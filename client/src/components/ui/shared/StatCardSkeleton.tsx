import React from "react";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

export const StatCardSkeleton: React.FC = () => {
  return (
    <Card
      className="flex flex-col justify-between gap-4 w-full
      border-[1px] border-gray-300 shadow-none min-h-32"
    >
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-16" />
      </div>
    </Card>
  );
};
