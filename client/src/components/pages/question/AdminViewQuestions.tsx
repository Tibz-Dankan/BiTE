import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { Loader2, Plus } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { AdminQuestionList } from "../../ui/question/AdminQuestionList";
import { Button } from "../../ui/shared/Btn";
import { useRouteStore } from "../../../stores/routes";

export const AdminViewQuestions: React.FC = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const quiz: TQuiz = data?.data ?? {};

  const navigateToNewQuestionPage = () => {
    navigate(`/a/quizzes/${quiz.id}/questions/new`);
    updateCurrentPage({
      title: "New Question",
      icon: undefined,
      path: `/a/quizzes/${quiz.id}/questions/new`,
      showInSidebar: false,
      element: undefined,
    });
  };

  if (isPending) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  return (
    <div className="w-full mt-4 space-y-8 mb-16">
      <div className="w-full flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">{quiz.title}</h2>
        </div>
        <Button
          type="button"
          onClick={() => navigateToNewQuestionPage()}
          className="bg-transparent text-gray-700 text-sm hover:text-(--primary)
          border-2 border-gray-600 h-auto py-1 hover:border-(--primary)"
        >
          <Plus className="w-4 h-4 hover:text-inherit -ml-[2px] mr-1" />
          <span className="hover:text-inherit font-[450]">Question</span>
        </Button>
      </div>
      <div className="w-full">
        <AdminQuestionList quiz={quiz} />
      </div>
    </div>
  );
};
