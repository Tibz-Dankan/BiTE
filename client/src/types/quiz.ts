import type { Attachment } from "./attachment";

export type TQuiz = {
  id: string;
  title: string;
  instructions: string;
  postedByUserID: string;
  startsAt: string;
  endsAt: string;
  canBeAttempted: boolean;
  createdAt: string;
  updatedAt: string;
  questions: null;
  attachments: Prettify<Attachment[]>;
};

export type TPagination = {
  limit: number;
  prevCursor: string;
};

export type TQuizResponse = {
  data: TQuiz[];
  pagination: TPagination;
  status: string;
};

export type TPostQuiz = {
  title: string;
  postedByUserID: string;
  startsAt: string;
  endsAt: string;
  instructions: string;
  file: any;
};

export type TUpdateQuiz = {
  id: string;
  title: string;
  postedByUserID: string;
  startsAt: string;
  endsAt: string;
  instructions: string;
};

export type TGetAllQuizzes = {
  limit: number;
  cursor?: string;
};

export type TUpdateQuizAttachment = {
  quizID: string;
  attachmentID: string;
  formData: FormData;
};
