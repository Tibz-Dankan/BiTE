import { useEffect, useState } from "react";
import { Button } from "../shared/Btn";
import { useQuery } from "@tanstack/react-query";
import { AlertCard } from "../shared/AlertCard";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import { useAuthStore } from "../../../stores/auth";
import type { TQuizUserProgressCount } from "../../../types/quiz";

export const UserQuizProgressFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const quizProgressStatusParam = searchParams.get("qzpStatus") ?? "";
  const [selectedQuizProgressStatus, setSelectedQuizProgressStatus] = useState(
    quizProgressStatusParam,
  );
  const userID = useAuthStore((state) => state.auth.user.id);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["quiz-user-progress", userID],
    queryFn: () => quizAPI.getQuizUserProgressCount({ userID: userID }),
  });

  const quizUserProgressCount: TQuizUserProgressCount = data?.data ?? {};

  useEffect(() => {
    if (data?.data) {
      setSelectedQuizProgressStatus(() => quizProgressStatusParam);
    }
  }, [data, quizProgressStatusParam]);

  const onSelectStatusHandler = (status: string) => {
    setSelectedQuizProgressStatus(() => status);
    setSearchParams(
      (prev) => {
        if (status) {
          prev.set("qzpStatus", status);
        } else {
          prev.delete("qzpStatus");
        }
        prev.delete("qzCursor"); // Reset cursor when changing category
        prev.delete("qzCategoryID"); // Reset category when changing status
        return prev;
      },
      { replace: false },
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
    <div className="w-full flex items-center justify-between gap-4 border-1 border-gray-300 rounded-2xl p-2">
      <div className="flex flex-wrap gap-3">
        {/* Un attempted */}
        <Button
          type="button"
          onClick={() => onSelectStatusHandler("un_attempted")}
          className={`rounded-2xl px-6 py-4 h-auto bg-gray-100 ${
            selectedQuizProgressStatus === "un_attempted"
              ? "bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/90 hover:text-gray-50 font-semibold"
              : "border-1 border-gray-300 text-gray-800 hover:bg-(--primary) hover:text-gray-50"
          }`}
        >
          <span>
            <span className="mr-2 border-2 border-inherit rounded-full p-1">
              {quizUserProgressCount.unattemptedCount}
            </span>
            <span>Un Attempted</span>
          </span>
        </Button>

        {/* In progress */}
        <Button
          type="button"
          onClick={() => onSelectStatusHandler("in_progress")}
          className={`rounded-2xl px-6 py-4 h-auto bg-gray-100 ${
            selectedQuizProgressStatus === "in_progress"
              ? "bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/90 hover:text-gray-50 font-semibold"
              : "border-1 border-gray-300 text-gray-800 hover:bg-(--primary) hover:text-gray-50"
          }`}
        >
          <span>
            <span className="mr-2 border-2 border-inherit rounded-full p-1">
              {quizUserProgressCount.inProgressCount}
            </span>
            In Progress
          </span>
        </Button>

        {/* Completed */}
        <Button
          type="button"
          onClick={() => onSelectStatusHandler("completed")}
          className={`rounded-2xl px-6 py-4 h-auto bg-gray-100 ${
            selectedQuizProgressStatus === "completed"
              ? "bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/90 hover:text-gray-50 font-semibold"
              : "border-1 border-gray-300 text-gray-800 hover:bg-(--primary) hover:text-gray-50"
          }`}
        >
          <span>
            <span className="mr-2 border-2 border-inherit rounded-full p-1">
              {quizUserProgressCount.completedCount}
            </span>
            Completed
          </span>
        </Button>
      </div>
    </div>
  );
};
