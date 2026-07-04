import React from "react";
import { Skeleton } from "../shared/Skeleton";

interface SatsRewardTableSkeletonProps {
  columnLabels: string[];
  rows?: number;
}

export const SatsRewardTableSkeleton: React.FC<
  SatsRewardTableSkeletonProps
> = ({ columnLabels, rows = 6 }) => {
  return (
    <div className="rounded-2xl border border-slate-100 shadow-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columnLabels.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </td>
                <td className="px-4 py-4 align-middle">
                  <Skeleton className="h-3 w-20" />
                </td>
                <td className="px-4 py-4 align-middle">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </td>
                <td className="px-4 py-4 align-middle">
                  <Skeleton className="h-4 w-14" />
                </td>
                <td className="px-4 py-4 align-middle">
                  <Skeleton className="h-3 w-32" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
