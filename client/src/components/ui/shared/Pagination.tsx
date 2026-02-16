import React from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./Btn";

interface PaginationProps {
  disablePrev: boolean;
  disableNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLoadingNext?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  disablePrev,
  disableNext,
  onPrev,
  onNext,
  isLoadingNext,
}) => {
  return (
    <div className="w-full flex items-center justify-end gap-8">
      <Button
        type={"button"}
        disabled={disablePrev}
        className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
         text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
        onClick={onPrev}
      >
        <div className="flex items-center justify-center gap-2 text-inherit">
          <ArrowLeft className="text-inherit w-4 h-4 text-sm -ml-2" />
          <span className="text-inherit w-4 h-4 text-[12px]">Prev</span>
        </div>
      </Button>
      <Button
        type={"button"}
        disabled={disableNext}
        className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
         text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
        onClick={onNext}
      >
        <>
          {!isLoadingNext && (
            <div className="flex items-center justify-center gap-2 text-inherit">
              <span className="text-inherit text-[12px]">Next</span>
              <ArrowRight className="text-inherit w-4 h-4" />
            </div>
          )}
          {isLoadingNext && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-inherit" />
              <span className="text-inherit text-[12px]">Loading...</span>
            </div>
          )}
        </>
      </Button>
    </div>
  );
};
