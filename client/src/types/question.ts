import type { TAnswer } from "./answer";
import type { TAttachment } from "./attachment";
import type { TPagination } from "./pagination";

export type TQuestion = {
  id: string;
  title: string;
  titleDelta: string;
  titleHTML: string;
  introduction: string;
  introductionDelta: string;
  introductionHTML: string;
  isDeltaDefault: boolean;
  postedByUserID: string;
  quizID: string;
  sequenceNumber: number;
  hasMultipleCorrectAnswers: boolean;
  requiresNumericalAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Prettify<TAnswer[]>;
  attachments: Prettify<TAttachment[]>;
};

export type TPostQuestion = {
  title: string;
  titleDelta: string;
  titleHTML: string;
  postedByUserID: string;
  introduction: string;
  introductionDelta: string;
  introductionHTML: string;
  quizID: string;
  sequenceNumber: number;
  hasMultipleCorrectAnswers: boolean;
  requiresNumericalAnswer: boolean;
  file: any;
};

export type TUpdateQuestion = {
  id: string;
  title: string;
  titleDelta: string;
  titleHTML: string;
  introduction: string;
  introductionDelta: string;
  introductionHTML: string;
  postedByUserID: string;
  quizID: string;
  sequenceNumber: number;
  hasMultipleCorrectAnswers: boolean;
  requiresNumericalAnswer: boolean;
};

export type TUpdateQuestionAttachment = {
  questionID: string;
  attachmentID: string;
  formData: FormData;
};

export type TSearchQuestion = {
  query: string;
  quizID: string;
};

export type TGetAllQuestionsByQuiz = {
  quizID: string;
  limit: number;
  cursor?: string;
};

export type TQuestionState = {
  questions: Prettify<TQuestion[]>;
  pagination: Prettify<TPagination>;
};

export type TQuestionsActions = {
  updateAllQuestions: (questions: TQuestion[]) => void;
  updateQuestion: (question: TQuestion) => void;
  updateQuestionAnswer: (answer: TAnswer) => void;
  updateQuestionAttachment: (attachment: TAttachment) => void;
  updateQuestionAnswerAttachment: (attachment: TAttachment) => void;
  updatePagination: (pagination: TPagination) => void;
  clearAll: () => void;
};
