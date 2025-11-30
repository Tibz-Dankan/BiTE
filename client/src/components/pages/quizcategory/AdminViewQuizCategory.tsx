import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { quizCategoryAPI } from "../../../api/quizCategory";
import type { TQuizCategory } from "../../../types/quizCategory";
// import type { TPagination } from "../../../types/pagination";
// import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
// import { Button } from "../../ui/shared/Btn";
import { QuizCategoryFilter } from "../../ui/quizcategory/QuizCategoryFilter";

export const AdminViewQuizCategory: React.FC = () => {
  // const navigate = useNavigate();
  const [quizCategories, setQuizCategories] = useState<TQuizCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  // const [searchParams] = useSearchParams();
  const cursor = searchParams.get("qzcCursor")!;
  const hasCursor: boolean = !!cursor;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-quiz-category-view-${cursor}`],
    queryFn: () =>
      quizCategoryAPI.getAll({ limit: 20, cursor: hasCursor ? cursor : "" }),
  });

  const quizCategoryList: TQuizCategory[] = data?.data ?? [];
  // const pagination: TPagination = data?.pagination ?? {};

  // const hasMoreQuizCategories: boolean = pagination.hasNextItems;
  // const disableNextBtn: boolean = isPending || !hasMoreQuizCategories;
  // const disablePrevBtn: boolean = !hasCursor;
  // const showNextLoader: boolean = isPending && hasCursor;

  // const loadNextQuizCategoryHandler = () => {
  //   setSearchParams(
  //     (prev) => {
  //       prev.set("qzcCursor", pagination!.nextCursor);
  //       return prev;
  //     },
  //     { replace: false }
  //   );
  // };

  // const loadPrevQuizCategoryHandler = () => {
  //   if (!cursor) return;
  //   navigate(-1);
  // };

  useEffect(() => {
    const updateQuizCategories = () => {
      setQuizCategories(quizCategoryList);
    };

    updateQuizCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSelectCategoryHandler = (categoryId: string) => {
    console.log("Selected categoryID: ", categoryId);
    setSelectedCategoryId(() => categoryId);
    setSearchParams(
      (prev) => {
        prev.set("qzCategoryID", categoryId);
        return prev;
      },
      { replace: false }
    );
  };

  if (isPending) {
    return (
      <div className="w-full min-h-[20vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[20vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }
  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <QuizCategoryFilter
          categories={quizCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategoryHandler}
        />
      </div>

      {/* Pagination action */}
      {/* <div className="w-full flex items-center justify-center gap-8">
        <Button
          type={"button"}
          disabled={disablePrevBtn}
          className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
           text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
          onClick={() => loadPrevQuizCategoryHandler()}
        >
          <div className="flex items-center justify-center gap-2 text-inherit">
            <ArrowLeft className="text-inherit w-4 h-4 text-sm -ml-2" />
            <span className="text-inherit w-4 h-4 text-[12px]">Prev</span>
          </div>
        </Button>
        <Button
          type={"button"}
          disabled={disableNextBtn}
          className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
           text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
          onClick={() => loadNextQuizCategoryHandler()}
        >
          <>
            {!showNextLoader && (
              <div className="flex items-center justify-center gap-2 text-inherit">
                <span className="text-inherit text-[12px]">Next</span>
                <ArrowRight className="text-inherit w-4 h-4" />
              </div>
            )}
            {showNextLoader && (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-inherit" />
                <span className="text-inherit text-[12px]">Loading...</span>
              </div>
            )}
          </>
        </Button>
      </div> */}
    </div>
  );
};
