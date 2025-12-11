import type { TAnswer } from "./answer";
import type { TUser } from "./auth";
import type { TQuestion } from "./question";
import type { TQuiz } from "./quiz";
import type { TPagination } from "./pagination";

export type Attempt = {
  id: string;
  userID: string;
  quizID: string;
  questionID: string;
  answerID: string;
  answerInput: string;
  createdAt: string;
  updatedAt: string;
  user?: TUser;
  quiz?: TQuiz;
  question?: TQuestion;
  answer?: TAnswer;
};

export type TPostAttempt = {
  userID: string;
  questionID: string;
  answerIDList: string[];
  answerInput: string;
};

export type TQuizAttemptData = {
  data: {
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
    questions: TQuestion[];
    attachments: any[];
  };
  message: string;
  pagination: TPagination & {
    count: number;
    hasNextItems: boolean;
    nextCursor: string;
  };
  status: string;
};

export type TAttemptFormValues = {
  answerID: string | string[];
  answerInput: string;
};
