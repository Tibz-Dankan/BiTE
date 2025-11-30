import type { TQuizCategory } from "../../../types/quizCategory";
import { Button } from "../shared/Btn";
import { DeleteQuizCategory } from "./DeleteQuizCategory";
import { UpdateQuizCategory } from "./UpdateQuizCategory";
interface QuizCategoryFilterProps {
  categories: TQuizCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const QuizCategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: QuizCategoryFilterProps) => {
  return (
    <div className="">
      <h2 className="text-2xl text-gray-800 font-bold mb-6 text-foreground">
        {/* Modules/Categories */}
        Filter by Category
      </h2>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => onSelectCategory("")}
          className={`rounded-full font-semibold px-6 py-2 bg-gray-100 ${
            selectedCategoryId === ""
              ? "bg-(--primary) text-gray-50 hover:bg-(--primary)/90"
              : "border-1 border-gray-300 text-gray-800  hover:bg-gray-100"
          }`}
        >
          All Quizzes
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`rounded-full font-semibold px-6 py-2 bg-gray-100 ${
              selectedCategoryId === category.id
                ? "bg-(--primary) text-gray-50 hover:bg-(--primary)/90"
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
          </Button>
        ))}
      </div>
    </div>
  );
};
