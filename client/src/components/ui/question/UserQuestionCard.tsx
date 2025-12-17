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
    <div className="w-full space-y-6 border border-gray-200 shadow-sm p-6 sm:p-8 rounded-2xl bg-white relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Quiz Details */}
      <div
        className="absolute top-0 left-0 w-full h-1.5"
        style={{
          backgroundColor: quizData.quizCategory?.color || "var(--primary)",
        }}
      />

      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-500">
            {/* Quiz Details */}
            Quiz
          </h3>
          {quizData.quizCategory && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
              style={{
                backgroundColor: `${quizData.quizCategory.color}20`,
                color: quizData.quizCategory.color,
              }}
            >
              {quizData.quizCategory.name}
            </span>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row items-stretch gap-6">
          <div
            className="w-12 md:w-72s shrink-0 aspect-video md:aspect-[4/3] relative flex items-center justify-center
            rounded-xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100 group"
          >
            {hasQuizAttachment ? (
              <img
                src={quizAttachments[0].url}
                alt={truncateString(quizData.title, 8)}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                <span
                  className="font-bold text-center text-lg leading-tight"
                  style={{ color: quizData.quizCategory?.color || "gray" }}
                >
                  {truncateString(quizData.title, 30)}
                </span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="prose prose-sm max-w-none text-gray-800">
              <QuillViewer deltaContent={quizTitleDelta} />
            </div>

            {/* Metadata badges could go here if we had more info to show, e.g. estimated time, difficulty */}
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
