import React, { useState } from "react";
import type { TQuestion } from "../../../types/question";
import { truncateString } from "../../../utils/truncateString";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { AdminAnswerCard } from "../answer/AdminAnswerCard";
import { Edit, MoreVertical, Plus } from "lucide-react";
import { Button } from "../shared/Btn";
import { Modal } from "../shared/Modal";
import { PostAnswer } from "../answer/PostAnswer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shared/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { SCNButton } from "../shared/button";
import { useRouteStore } from "../../../stores/routes";
import { QuillViewer } from "../shared/QuillViewer";

interface QuestionCardProps {
  question: TQuestion;
}

export const AdminQuestionCard: React.FC<QuestionCardProps> = (props) => {
  const question = props.question;
  const [closePostAnswerModal, setClosePostAnswerModal] = useState(false);
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const attachments = question.attachments;
  const hasAttachment = isArrayWithElements(attachments);

  const answers = question.answers;
  const hasAnswers = isArrayWithElements(answers);

  const hasIntroduction = !!question.introduction;

  const titleDelta = question.titleDelta;
  const introductionDelta = question.introductionDelta;

  const navigateToEditQuestionPage = (question: TQuestion) => {
    navigate(`/a/quizzes/${question.quizID}/questions/${question.id}/edit`);
    updateCurrentPage({
      title: "Edit Question",
      icon: undefined,
      path: "/a/quizzes/:quizID/questions/:questionID/edit",
      showInSidebar: false,
      element: undefined,
    });
  };

  const onPostAnswerSuccess = (succeeded: boolean) => {
    setClosePostAnswerModal(() => succeeded);
    setTimeout(() => {
      setClosePostAnswerModal(() => false);
    }, 2000);
  };

  return (
    <div className="w-full space-y-4 border-1 border-gray-800/30 p-8 rounded-2xl">
      <div className="w-full space-y-2">
        <div className="w-full flex items-center justify-between">
          <p className="flex gap-1">
            <span>Question</span>
            <span>{question.sequenceNumber}</span>
          </p>
          {/* Question actions drop down */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SCNButton className="p-1 py-0">
                <MoreVertical className="w-5 h-5 text-gray-800" />
              </SCNButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center" className="bg-gray-50">
              <DropdownMenuItem
                onClick={() => navigateToEditQuestionPage(question)}
                className="cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4 text-gray-800" />
                  Edit Question
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-start justify-center gap-4">
          <div
            className="w-full sm:w-80 min-h-32  flex items-center justify-center
            border-1 border-gray-300 rounded-md"
          >
            {hasAttachment && (
              <img
                src={attachments[0].url}
                alt={truncateString(question.title, 8)}
                className="w-full h-full object-cover object-center rounded-md"
              />
            )}
            {!hasAttachment && (
              <div
                className="w-full h-full aspect-2/1 bg-gray-500 flex
                items-center justify-center rounded-md"
              >
                <span className="text-gray-50 font-semibold">
                  {truncateString(question.title, 20)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full">
            <QuillViewer deltaContent={titleDelta} />
          </div>
        </div>
      </div>
      {hasIntroduction && (
        <div className="w-full flex flex-col gap-1">
          <h1>Intro</h1>
          <QuillViewer deltaContent={introductionDelta} />
        </div>
      )}
      <div className="w-full flex items-center justify-between gap-4">
        <span>Answers</span>
        <Modal
          openModalElement={
            <div>
              <Button
                type="button"
                className="flex items-center justify-center gap-1 h-auto py-1 px-3"
              >
                <Plus className="w-4 h-4 text-gray-50" />
                <span className="text-sm">Answer</span>
              </Button>
            </div>
          }
          closed={closePostAnswerModal}
        >
          <div
            className="w-[90vw] sm:w-[50vw] min-h-[50vh] h-auto max-h-[80vh] bg-gray-50
            rounded-md p-4 flex items-start justify-center overflow-x-hidden"
          >
            <PostAnswer question={question} onSuccess={onPostAnswerSuccess} />
          </div>
        </Modal>
      </div>
      {/* <div className="w-full flex flex-col gap-2">
        <h1>Intro</h1>
        <p className="text-gray-600 text-[12px]">{question.introduction}</p>
      </div> */}
      <div className="w-full space-y-4">
        {hasAnswers &&
          answers.map((answer, index) => (
            <div key={index} className="w-full">
              <AdminAnswerCard answer={answer} />
            </div>
          ))}
        {!hasAnswers && (
          <span className="text-[12px] text-gray-400">
            No answers for this question
          </span>
        )}
      </div>
    </div>
  );
};
