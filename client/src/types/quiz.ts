import type { TAttachment } from "./attachment";

export type TQuiz = {
  id: string;
  title: string;
  titleDelta: string;
  titleHTML: string;
  introduction: string;
  introductionDelta: string;
  introductionHTML: string;
  instructions: string;
  instructionsDelta: string;
  instructionsHTML: string;
  isDeltaDefault: boolean;
  postedByUserID: string;
  quizCategoryID: string;
  startsAt: string;
  endsAt: string;
  canBeAttempted: boolean;
  createdAt: string;
  updatedAt: string;
  questions: null;
  attachments: Prettify<TAttachment[]>;
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
  titleDelta?: string;
  titleHTML?: string;
  introduction: string;
  introductionDelta?: string;
  introductionHTML?: string;
  postedByUserID: string;
  startsAt: string;
  endsAt: string;
  instructions: string;
  instructionsDelta?: string;
  instructionsHTML?: string;
  file: any;
};

export type TUpdateQuiz = {
  id: string;
  title: string;
  titleDelta?: string;
  titleHTML?: string;
  introduction: string;
  introductionDelta?: string;
  introductionHTML?: string;
  postedByUserID: string;
  startsAt: string;
  endsAt: string;
  instructions: string;
  instructionsDelta?: string;
  instructionsHTML?: string;
};

export type TGetAllQuizzes = {
  limit: number;
  cursor?: string;
  quizCategoryID?: string;
};

export type TUpdateQuizAttachment = {
  quizID: string;
  attachmentID: string;
  formData: FormData;
};

export type TQuizAnalytics = {
  count: {
    answers: number;
    questions: number;
    quizzes: number;
  };
};
