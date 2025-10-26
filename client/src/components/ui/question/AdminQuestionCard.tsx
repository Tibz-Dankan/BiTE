import React from "react";
import type { TQuestion } from "../../../types/question";
import { truncateString } from "../../../utils/truncateString";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { AdminAnswerCard } from "../answer/AnswerCard";
import { Plus } from "lucide-react";
import { Button } from "../shared/Btn";

interface QuestionCardProps {
  question: TQuestion;
}

export const AdminQuestionCard: React.FC<QuestionCardProps> = (props) => {
  const question = props.question;

  const attachments = question.attachments;
  const hasAttachment = isArrayWithElements(attachments);

  const answers = question.answers;
  const hasAnswers = isArrayWithElements(answers);

  return (
    <div className="w-full space-y-4 border-1 border-gray-800/30 p-8 rounded-2xl">
      <div className="w-full space-y-2">
        <div className="w-full flex items-center justify-between">
          <p className="flex gap-1">
            <span>Question</span>
            <span>{question.sequenceNumber}</span>
          </p>
        </div>
        <div className="w-full flex items-start justify-center gap-4">
          <div
            className="w-68 min-h-28 flex items-center justify-center
            border-1 border-gray-300 rounded-md"
          >
            {hasAttachment && (
              <img
                src={attachments[0].url}
                alt={truncateString(question.title, 8)}
                className="w-full object-cover object-center rounded-md"
              />
            )}
            {!hasAttachment && (
              <div
                className="w-68a min-h-28s w-full h-28 bg-gray-500 flex
               items-center justify-center rounded-md"
              >
                <span className="text-gray-50 font-semibold">
                  {truncateString(question.title, 20)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full h-auto bg-green-500s text-sm text-gray-600">
            <p>{question.title}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <span>Answers</span>
        <Button
          type="button"
          className="flex items-center justify-center gap-1 h-auto py-1 px-3"
        >
          <Plus className="w-4 h-4 text-gray-50" />
          <span className="text-sm">Answer</span>
        </Button>
      </div>
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
