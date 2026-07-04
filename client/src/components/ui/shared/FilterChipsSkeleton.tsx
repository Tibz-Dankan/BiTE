import React from "react";
import { Skeleton } from "./Skeleton";

interface FilterChipsSkeletonProps {
  count?: number;
}

const CHIP_WIDTHS = ["w-24", "w-32", "w-20", "w-28", "w-36", "w-24"];

export const FilterChipsSkeleton: React.FC<FilterChipsSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-8 ${CHIP_WIDTHS[i % CHIP_WIDTHS.length]} rounded-full`}
        />
      ))}
    </div>
  );
};
