import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";
import type { TQuiz } from "../../../types/quiz";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { UpdateQuestion } from "../../ui/question/UpdateQuestion";
import { UpdateQuestionAttachment } from "../../ui/question/UpdateQuestionAttachment";
import { questionAPI } from "../../../api/question";
import type { TQuestion } from "../../../types/question";
import { UpdateQuestionFormHeading } from "../../ui/question/UpdateQuestionFormHeading";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { isJSON } from "../../../utils/isJson";

export const AdminUpdateQuestion: React.FC = () => {
  const { quizID, questionID } = useParams();

  const {
    isPending: isPendingGetQuiz,
    isError: isGetQuizError,
    data: QuizData,
    error: getQuizError,
  } = useQuery({
    queryKey: [`quiz-${quizID}`],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
  });

  const {
    isPending: isPendingGetQuestion,
    isError: isGetQuestionError,
    data: QuestionData,
    error: getQuestionError,
  } = useQuery({
    queryKey: [`question-${questionID}`],
    queryFn: () => questionAPI.getByID({ id: questionID! }),
  });

  const isPending = isPendingGetQuiz || isPendingGetQuestion;
  const isError = isGetQuizError || isGetQuestionError;
  const error = getQuizError || getQuestionError;

  const quiz: TQuiz = QuizData?.data ?? {};
  const question: TQuestion = QuestionData?.data ?? {};

  const attachments = question.attachments;
  const hasAttachment = isArrayWithElements(attachments);

  const quizTitleDelta = quiz.isDeltaDefault
    ? isJSON(quiz.titleDelta!)
      ? quiz.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(quiz.title))
    : JSON.stringify(convertPlainTextToDelta(quiz.title));

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
    <div className="w-full space-y-8 mt-8">
      <div className="w-full">
        <UpdateQuestionFormHeading quizTitleDelta={quizTitleDelta} />
      </div>
      <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
        <div className="flex items-center">
          <UpdateQuestionAttachment
            questionID={question.id}
            attachmentID={hasAttachment ? attachments[0]?.id : ""}
            attachmentURL={hasAttachment ? attachments[0]?.url : ""}
            questionTitle={question.title}
            questionSequenceNumber={question.sequenceNumber}
          />
        </div>
        <div className="w-full">
          <UpdateQuestion question={question} />
        </div>
      </div>
    </div>
  );
};
