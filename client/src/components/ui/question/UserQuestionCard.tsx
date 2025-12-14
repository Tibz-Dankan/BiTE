import React, { useState } from "react";
import type { TQuestion } from "../../../types/question";
import type { TQuizAttemptData } from "../../../types/attempt";
import { truncateString } from "../../../utils/truncateString";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { QuillViewer } from "../shared/QuillViewer";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { isJSON } from "../../../utils/isJson";
import { UserAnswerCard } from "../answer/UserAnswerCard";
import { QuizCompletionCard } from "../quiz/QuizCompletionCard";

interface UserQuestionCardProps {
  quizData: TQuizAttemptData["data"];
  question: TQuestion;
  quizID: string;
  pagination: TQuizAttemptData["pagination"];
}

export const UserQuestionCard: React.FC<UserQuestionCardProps> = ({
  quizData,
  question,
  quizID,
  pagination,
}) => {
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const quizAttachments = quizData.attachments;
  const hasQuizAttachment = isArrayWithElements(quizAttachments);

  const questionAttachments = question.attachments;
  const hasQuestionAttachment = isArrayWithElements(questionAttachments);

  const hasIntroduction = !!question.introduction;

  const quizTitleDelta = quizData.isDeltaDefault
    ? isJSON(quizData.titleDelta!)
      ? quizData.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(quizData.title))
    : JSON.stringify(convertPlainTextToDelta(quizData.title));

  const questionTitleDelta = question.isDeltaDefault
    ? isJSON(question.titleDelta!)
      ? question.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(question.title))
    : JSON.stringify(convertPlainTextToDelta(question.title));

  const introductionDelta = question.isDeltaDefault
    ? isJSON(question.introductionDelta!)
      ? question.introductionDelta!
      : JSON.stringify(convertPlainTextToDelta(question.introduction))
    : JSON.stringify(convertPlainTextToDelta(question.introduction));

  const onQuizCompletedHandler = (completed: boolean) => {
    setIsQuizCompleted(() => completed);
  };

  if (isQuizCompleted) {
    return <QuizCompletionCard quizID={quizID} />;
  }

  return (
    <div className="w-full space-y-4 border-1 border-gray-800/30 p-8 rounded-2xl">
      {/* Quiz Details */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Quiz</h3>
        <div className="w-full flex flex-col sm:flex-row items-start justify-center gap-4">
          <div
            className="w-full sm:w-60 min-h-28 flex items-center justify-center
            border-1 border-gray-300 rounded-md"
          >
            {hasQuizAttachment && (
              <img
                src={quizAttachments[0].url}
                alt={truncateString(quizData.title, 8)}
                className="w-full h-full object-cover object-center rounded-md"
              />
            )}
            {!hasQuizAttachment && (
              <div
                className="w-full h-full aspect-2/1 bg-gray-500 flex
                items-center justify-center rounded-md"
              >
                <span className="text-gray-50 font-semibold text-center p-2">
                  {truncateString(quizData.title, 30)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full">
            <QuillViewer deltaContent={quizTitleDelta} />
          </div>
        </div>
      </div>

      {/* Question Details */}
      <div className="w-full space-y-2">
        <div className="w-full flex items-center justify-between">
          <p className="flex gap-1 font-medium text-gray-700">
            <span>Question</span>
            <span>{question.sequenceNumber}</span>
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-start justify-center gap-4">
          <div
            className="w-full sm:w-80 min-h-32 flex items-center justify-center
            border-1 border-gray-300 rounded-md"
          >
            {hasQuestionAttachment && (
              <img
                src={questionAttachments[0].url}
                alt={truncateString(question.title, 8)}
                className="w-full h-full object-cover object-center rounded-md"
              />
            )}
            {!hasQuestionAttachment && (
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
            <QuillViewer deltaContent={questionTitleDelta} />
          </div>
        </div>
      </div>

      {hasIntroduction && (
        <div className="w-full flex flex-col gap-1">
          <h4 className="font-medium text-gray-700">Introduction</h4>
          <QuillViewer deltaContent={introductionDelta} />
        </div>
      )}

      <div className="w-full flex items-center justify-between gap-4">
        <span>Answers</span>
      </div>

      {/* UserAnswerCard component with form */}
      <UserAnswerCard
        question={question}
        quizID={quizID}
        pagination={pagination}
        onQuizCompleted={onQuizCompletedHandler}
      />
    </div>
  );
};
