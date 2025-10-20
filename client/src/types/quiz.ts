import type { Attachment } from "./attachment";

export type Quiz = {
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

export type Pagination = {
  limit: number;
  prevCursor: string;
};

export type QuizResponse = {
  data: Quiz[];
  pagination: Pagination;
  status: string;
};

export type UpdateQuiz = {
  id: string;
  title: string;
  postedByUserID: string;
  startsAt: string;
  endsAt: string;
  instructions: string;
};

export type UpdateQuizAttachment = {
  quizID: string;
  attachmentID: string;
  formData: FormData;
};
