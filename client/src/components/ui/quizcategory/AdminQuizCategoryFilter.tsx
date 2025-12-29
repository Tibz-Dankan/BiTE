import type { TQuizCategory } from "../../../types/quizCategory";
import { DeleteQuizCategory } from "./DeleteQuizCategory";
import { UpdateQuizCategory } from "./UpdateQuizCategory";
import { AddQuizCategoryButton } from "./AddQuizCategoryButton";
import { quizCategoryAPI } from "../../../api/quizCategory";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";

export const AdminQuizCategoryFilter: React.FC = () => {
  const [quizCategories, setQuizCategories] = useState<TQuizCategory[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialquizCategoryID = searchParams.get("qzCategoryID") ?? "";
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialquizCategoryID
  );

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-quiz-category-view`],
    queryFn: () => quizCategoryAPI.getAll({ limit: 20, cursor: "" }),
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
        {/* Modules/Categories */}
        Filter by Category
      </h2>
      <div className="flex flex-wrap gap-3">
        <span
          onClick={() => onSelectCategoryHandler("")}
          className={`flex items-center justify-center rounded-full
             px-6 py-2 h-10 cursor-pointer ${
               selectedCategoryId === ""
                 ? "bg-(--primary) text-gray-50 hover:bg-(--primary)/90 font-semibold"
                 : "border-1 border-gray-300 text-gray-800  hover:bg-gray-100"
             }`}
        >
          All Quizzes
        </span>
        {quizCategories.map((category) => (
          <span
            key={category.id}
            onClick={() => onSelectCategoryHandler(category.id)}
            className={`flex items-center justify-center rounded-full
               px-6 py-2 h-10 cursor-pointer ${
                 selectedCategoryId === category.id
                   ? "bg-(--primary) text-gray-50 hover:bg-(--primary)/90 font-semibold"
                   : "border-1 border-gray-300 text-gray-800 hover:bg-(--primary) hover:text-gray-50"
               }`}
          >
            <span>{category.name}</span>
            <div className="z-50 mx-2 rounded-md hover:bg-gray-300">
              <DeleteQuizCategory quizCategory={category} />
            </div>
            <div className="z-50 rounded-md hover:bg-gray-300">
              <UpdateQuizCategory quizCategory={category} />
            </div>
          </span>
        ))}
        {/* Add Quiz Category Button */}
        <AddQuizCategoryButton />
      </div>
    </div>
  );
};
