import { useEffect, useState } from "react";
import type { TQuizCategory } from "../../../types/quizCategory";
import { Button } from "../shared/Btn";
import { quizCategoryAPI } from "../../../api/quizCategory";
import { useQuery } from "@tanstack/react-query";
import { AlertCard } from "../shared/AlertCard";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const UserQuizCategoryFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizCategories, setQuizCategories] = useState<TQuizCategory[]>([]);
  const initialquizCategoryID = searchParams.get("qzCategoryID") ?? "";
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialquizCategoryID
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["user-quiz-categories"],
    queryFn: () => quizCategoryAPI.getAll({ limit: 25, cursor: "" }),
  });

  useEffect(() => {
    if (data?.data) {
      setQuizCategories(data.data);
    }
  }, [data]);

  const onSelectCategoryHandler = (categoryId: string) => {
    setSelectedCategoryId(() => categoryId);
    setSearchParams(
      (prev) => {
        if (categoryId) {
          prev.set("qzCategoryID", categoryId);
        } else {
          prev.delete("qzCategoryID");
        }
        prev.delete("qzCursor"); // Reset cursor when changing category
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
    <div className="">
      <h2 className="text-2xl text-gray-800 font-bold mb-6 text-foreground">
        Filter by Category
      </h2>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => onSelectCategoryHandler("")}
          className={`rounded-full font-semibold px-6 py-2 bg-gray-100 ${
            selectedCategoryId === ""
              ? "bg-(--primary) text-gray-50 hover:bg-(--primary)/90"
              : "border-1 border-gray-300 text-gray-800  hover:bg-gray-100"
          }`}
        >
          All Quizzes
        </Button>
        {quizCategories.map((category) => (
          <Button
            key={category.id}
            type="button"
            onClick={() => onSelectCategoryHandler(category.id)}
            className={`rounded-full font-semibold px-6 py-2 bg-gray-100 ${
              selectedCategoryId === category.id
                ? "bg-(--primary) text-gray-50 hover:bg-(--primary)/90"
                : "border-1 border-gray-300 text-gray-800 hover:bg-(--primary) hover:text-gray-50"
            }`}
          >
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
