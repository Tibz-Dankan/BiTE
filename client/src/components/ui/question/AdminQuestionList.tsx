import React from "react";
import type { TQuiz } from "../../../types/quiz";
import { FileQuestion, Loader2, Plus } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { questionAPI } from "../../../api/question";
import type { TQuestion } from "../../../types/question";
import { AdminQuestionCard } from "./AdminQuestionCard";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { Button } from "../shared/Btn";
import { truncateString } from "../../../utils/truncateString";
import { useRouteStore } from "../../../stores/routes";

interface AdminQuestionListProps {
  quiz: TQuiz;
}

export const AdminQuestionList: React.FC<AdminQuestionListProps> = (props) => {
  const quiz = props.quiz;
  const { quizID } = useParams();
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}-questions`],
    queryFn: () => questionAPI.getAllByQuiz({ quizID: quizID! }),
  });

  const questions: TQuestion[] = data?.data ?? {};
  const hasQuestions = isArrayWithElements(questions);

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
    <div className="w-full mb-16">
      {/* Search Question here  */}
      {hasQuestions && (
        <div className="w-full flex flex-col gap-8">
          {questions.map((qtn, index) => (
            <div key={index} className="full">
              <AdminQuestionCard question={qtn} />
            </div>
          ))}
        </div>
      )}
      {!hasQuestions && (
        <div
          className="w-full bg-white flex flex-col items-center justify-center
           gap-4 rounded-md shadow-sm p-8 md:p-12"
        >
          <span>
            <FileQuestion className="w-16 h-16 text-gray-500" />
          </span>
          <h3 className="text-lg text-gray-800 font-semibold">
            No questions found
          </h3>
          <p className="text-sm">
            <span className="mr-1 text-gray-500">
              No questions has been upload to the quiz
            </span>
            <span className="font-semibold">
              {truncateString(quiz.title, 36)}
            </span>
          </p>
          <Button type="button" onClick={() => navigateToNewQuestionPage()}>
            <span className="flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-50 mr-2" />
              Question
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
