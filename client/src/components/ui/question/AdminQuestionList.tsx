import React, { useEffect } from "react";
import type { TQuiz } from "../../../types/quiz";
import {
  ArrowLeft,
  ArrowRight,
  FileQuestion,
  Loader2,
  Plus,
} from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { questionAPI } from "../../../api/question";
import type { TQuestion } from "../../../types/question";
import { AdminQuestionCard } from "./AdminQuestionCard";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { Button } from "../shared/Btn";
import { truncateString } from "../../../utils/truncateString";
import { useRouteStore } from "../../../stores/routes";
import type { TPagination } from "../../../types/pagination";

interface AdminQuestionListProps {
  quiz: TQuiz;
}

export const AdminQuestionList: React.FC<AdminQuestionListProps> = (props) => {
  const quiz = props.quiz;
  const [searchParams, setSearchParams] = useSearchParams();
  const { quizID } = useParams();
  const cursor = searchParams.get("qtnCursor")!;
  const hasCursor: boolean = !!cursor;

  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`quiz-${quizID}-questions-${cursor}`],
    queryFn: () =>
      questionAPI.getAllByQuiz({
        quizID: quizID!,
        limit: 12,
        cursor: hasCursor ? cursor : "",
      }),
  });

  const questions: TQuestion[] = data?.data ?? {};
  const hasQuestions = isArrayWithElements(questions);

  const pagination: TPagination = data?.pagination ?? {};

  const hasMoreQuizzes: boolean = pagination.hasNextItems;
  const disableNextBtn: boolean = isPending || !hasMoreQuizzes;
  const disablePrevBtn: boolean = !hasCursor;
  const showNextLoader: boolean = isPending && hasCursor;

  const loadNextQuizzesHandler = () => {
    setSearchParams(
      (prev) => {
        prev.set("qtnCursor", pagination!.nextCursor);
        return prev;
      },
      { replace: false }
    );
  };

  const loadPrevQuizzesHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  useEffect(() => {
    const updateQuestionsInStore = () => {
      //  update actins here
      // setPagination(() => data?.pagination ?? {});
    };
    updateQuestionsInStore();
  }, [data]);

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
    <div className="w-full mb-16 space-y-8">
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
          <h3
            className="text-lg text-gray-800 font-semibold
            text-center"
          >
            No questions found
          </h3>
          <p className="text-sm text-center">
            <span className="mr-1 text-gray-500">
              No questions has been upload to the quiz
            </span>
            <span className="font-semibold">
              {truncateString(quiz.title, 36)}
            </span>
          </p>
          <Button type="button" onClick={() => navigateToNewQuestionPage()}>
            <span className="flex items-center justify-center text-center">
              <Plus className="w-5 h-5 text-gray-50 mr-2" />
              Question
            </span>
          </Button>
        </div>
      )}

      {/* Pagination Actions */}
      {hasQuestions && (
        <div className="w-full flex items-center justify-end gap-8">
          <Button
            type={"button"}
            disabled={disablePrevBtn}
            className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
            text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
            onClick={() => loadPrevQuizzesHandler()}
          >
            <div className="flex items-center justify-center gap-2 text-inherit">
              <ArrowLeft className="text-inherit w-4 h-4 text-sm -ml-2" />
              <span className="text-inherit w-4 h-4 text-[12px]">Prev</span>
            </div>
          </Button>
          <Button
            type={"button"}
            disabled={disableNextBtn}
            className="min-w-28 bg-gray-800/10 border-[1px] border-gray-300
            text-orange-500 disabled:text-orange-500/50 h-auto py-2 px-2"
            onClick={() => loadNextQuizzesHandler()}
          >
            <>
              {!showNextLoader && (
                <div className="flex items-center justify-center gap-2 text-inherit">
                  <span className="text-inherit text-[12px]">Next</span>
                  <ArrowRight className="text-inherit w-4 h-4" />
                </div>
              )}
              {showNextLoader && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-inherit" />
                  <span className="text-inherit text-[12px]">Loading...</span>
                </div>
              )}
            </>
          </Button>
        </div>
      )}
    </div>
  );
};
