import { UserQuizCategoryFilter } from "../../ui/quizcategory/UserQuizCategoryFilter";
import { UserQuizViewHeader } from "../../ui/quiz/UserQuizViewHeader";
import { UserQuizList } from "../../ui/quiz/UserQuizList";
import { UserQuizProgressFilter } from "../../ui/quiz/UserQuizProgressFilter";

export const UserQuizView: React.FC = () => {
  return (
    <div className="min-h-screen space-y-12">
      <UserQuizViewHeader />
      <UserQuizProgressFilter />
      <div className="space-y-12">
        <UserQuizCategoryFilter />
        <UserQuizList />
      </div>
    </div>
  );
};
