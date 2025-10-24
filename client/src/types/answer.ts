import type { Attachment } from "./attachment";

export type TAnswer = {
  id: string;
  title: string;
  postedByUserID: string;
  questionID: string;
  sequenceNumber: number;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  attachments: Prettify<Attachment[]>;
};

export type TPostAnswer = {
  title: string;
  postedByUserID: string;
  questionID: string;
  sequenceNumber: number;
  isCorrect: boolean;
  file: any;
};

export type TUpdateAnswer = {
  id: string;
  title: string;
  postedByUserID: string;
  questionID: string;
  sequenceNumber: number;
  isCorrect: boolean;
};

export type TUpdateAnswerAttachment = {
  answerID: string;
  attachmentID: string;
  formData: FormData;
};
