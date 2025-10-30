import type { TAnswer } from "./answer";
import type { TAttachment } from "./attachment";
import type { TPagination } from "./pagination";

export type TQuestion = {
  id: string;
  title: string;
  postedByUserID: string;
  quizID: string;
  sequenceNumber: number;
  hasMultipleCorrectAnswers: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Prettify<TAnswer[]>;
  attachments: Prettify<TAttachment[]>;
};

export type TPostQuestion = {
  title: string;
  postedByUserID: string;
  quizID: string;
  sequenceNumber: number;
  hasMultipleCorrectAnswers: boolean;
  file: any;
};

export type TUpdateQuestion = {
  id: string;
  title: string;
  postedByUserID: string;
  quizID: string;
  sequenceNumber: number;
  hasMultipleCorrectAnswers: boolean;
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
