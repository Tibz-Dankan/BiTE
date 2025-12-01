import { UserQuizCategoryFilter } from "../../ui/quizcategory/UserQuizCategoryFilter";
import { UserQuizViewHeader } from "../../ui/quiz/UserQuizViewHeader";
import { UserQuizList } from "../../ui/quiz/UserQuizList";

export const UserQuizView: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50
      space-y-12"
    >
      <UserQuizViewHeader />
      <UserQuizCategoryFilter />
      <UserQuizList />
    </div>
  );
};
