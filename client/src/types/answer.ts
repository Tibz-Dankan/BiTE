import type { TAttachment } from "./attachment";

export type TAnswer = {
  id: string;
  title: string;
  titleDelta: string;
  titleHTML: string;
  isDeltaDefault: boolean;
  postedByUserID: string;
  questionID: string;
  sequenceNumber: number;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  attachments: Prettify<TAttachment[]>;
};

export type TPostAnswer = {
  title: string;
  titleDelta: string;
  titleHTML: string;
  postedByUserID: string;
  questionID: string;
  sequenceNumber: number;
  isCorrect: boolean;
  file: any;
};

export type TUpdateAnswer = {
  id: string;
  title: string;
  titleDelta: string;
  titleHTML: string;
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
