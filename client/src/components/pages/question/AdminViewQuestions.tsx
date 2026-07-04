import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { Plus } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { AdminQuestionList } from "../../ui/question/AdminQuestionList";
import { Skeleton } from "../../ui/shared/Skeleton";
import { AdminQuestionCardSkeleton } from "../../ui/question/AdminQuestionCardSkeleton";
import { Button } from "../../ui/shared/Btn";
import { useRouteStore } from "../../../stores/routes";
import { QuillViewer } from "../../ui/shared/QuillViewer";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { isJSON } from "../../../utils/isJson";
import { QuizAIPreviewOpsCard } from "../../ui/aipreview/QuizAIPreviewOpsCard";
import { useFeatureFlagEnabled } from "@posthog/react";

export const AdminViewQuestions: React.FC = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const isAIPreviewflagEnabled = useFeatureFlagEnabled("ai-preview-admin");

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const quiz: TQuiz = data?.data ?? {};

  const titleDelta = quiz.isDeltaDefault
    ? isJSON(quiz.titleDelta)
      ? quiz.titleDelta
      : JSON.stringify(convertPlainTextToDelta(quiz.title))
    : JSON.stringify(convertPlainTextToDelta(quiz.title));

  const introductionDelta = quiz.isDeltaDefault
    ? isJSON(quiz.introductionDelta)
      ? quiz.introductionDelta
      : JSON.stringify(convertPlainTextToDelta(quiz.introduction))
    : JSON.stringify(convertPlainTextToDelta(quiz.introduction));

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
      <div className="w-full mt-4 space-y-8">
        <div className="w-full flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        <div className="w-full flex flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="w-full flex flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <AdminQuestionCardSkeleton key={i} />
          ))}
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
    <div className="w-full mt-4 space-y-8">
      <div className="w-full flex items-center justify-between gap-4">
        <div>
          <QuillViewer deltaContent={titleDelta} />
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
      {isAIPreviewflagEnabled && <QuizAIPreviewOpsCard quizID={quizID!} />}
      <div className="w-full">
        <QuillViewer deltaContent={introductionDelta} />
      </div>
      <div className="w-full">
        <AdminQuestionList quiz={quiz} />
      </div>
    </div>
  );
};
