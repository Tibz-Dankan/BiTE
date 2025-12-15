import type { TAttachment } from "./attachment";
import type { TQuizCategory } from "./quizCategory";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
  profileBgColor?: string;
};

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
  quizCategory?: TQuizCategory;
  postedByUser?: TUser;
  questionCount?: number;
  attemptCount?: number;
  userProgress?: TUserProgress;
};

export type TUserProgress = {
  status: "IN_PROGRESS" | "COMPLETED";
  totalAttemptedQuestions: number;
  totalQuestions: number;
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
  quizCategoryID: string;
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
  quizCategoryID: string;
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

export type TAdminAnalytics = {
  status: string;
  message: string;
  data: {
    // averageCorrectScore: number; // REMOVED
    averageCorrectScorePerQuiz: number;
    totalAnswers: number;
    totalAttemptDuration: number;
    totalQuizzesAttempted: number;
    totalQuestionsAttempted: number;
    totalQuestions: number;
    totalQuizzes: number;
    totalSiteVisits: number;
    totalUserSessions: number;
    totalUsers: number;
  };
};

export type TUserAnalytics = {
  status: string;
  message: string;
  data: {
    averageAttemptDuration: number;
    averageCorrectScore: number;
    rank: number;
    totalAttemptDuration: number;
    totalAttempts: number; // This is now total questions attempted (distinct) but mapped from backend "totalQuestionsAttempted"
    totalQuestionsAttempted: number;
    totalQuizzesAttempted: number;
  };
};
