import type { TAnswer } from "./answer";
import type { Attachment } from "./attachment";

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
  attachments: Prettify<Attachment[]>;
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
