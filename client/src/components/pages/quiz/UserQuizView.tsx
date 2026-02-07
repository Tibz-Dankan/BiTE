import { UserQuizCategoryFilter } from "../../ui/quizcategory/UserQuizCategoryFilter";
import { UserQuizViewHeader } from "../../ui/quiz/UserQuizViewHeader";
import { UserQuizList } from "../../ui/quiz/UserQuizList";
import { useSearchParams } from "react-router-dom";
import { UserQuizListProgress } from "../../ui/quiz/UserQuizListProgress";
import { UserQuizProgressFilter } from "../../ui/quiz/UserQuizProgressFilter";

export const UserQuizView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const quizProgressStatusParam = searchParams.get("qzpStatus");

  const showQuizList: boolean =
    quizProgressStatusParam === "un_attempted" || !quizProgressStatusParam;
  const showQuizListProgress: boolean =
    quizProgressStatusParam === "in_progress" ||
    quizProgressStatusParam === "completed";

  return (
    <div className="min-h-screen space-y-12">
      <UserQuizViewHeader />
      <UserQuizProgressFilter />
      {showQuizList && (
        <div className="space-y-12">
          <UserQuizCategoryFilter />
          <UserQuizList />
        </div>
      )}
      {showQuizListProgress && <UserQuizListProgress />}
    </div>
  );
};
