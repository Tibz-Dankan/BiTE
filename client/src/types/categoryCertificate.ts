import type { TAttachment } from "./attachment";
import type { TPagination } from "./pagination";
import type { TQuizCategory } from "./quizCategory";

export type TCategoryCertificate = {
  id: string;
  quizCategoryID: string;
  createdAt: string;
  updatedAt: string;
  quizCategory?: TQuizCategory;
  categoryCertificateQuizzes?: TCategoryCertificateQuiz[];
};

export type TCategoryCertificateQuiz = {
  id: string;
  categoryCertificateID: string;
  quizID: string;
  createdAt: string;
  updatedAt: string;
  quiz?: {
    id: string;
    title: string;
    titleHTML: string;
    showQuiz: boolean;
    canBeAttempted: boolean;
    createdAt: string;
    updatedAt: string;
    attachments?: TAttachment[];
  };
};

export type TCertificateAwarded = {
  id: string;
  userID: string;
  categoryCertificateID: string;
  awardedQuizIDs: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
  categoryCertificate?: TCategoryCertificate;
  attachments?: TAttachment[];
};

export type TPostCategoryCertificate = {
  quizCategoryID: string;
};

export type TUpdateCategoryCertificate = {
  id: string;
  quizCategoryID: string;
};

export type TPatchCategoryCertificate = {
  id: string;
  quizCategoryID?: string;
};

export type TDeleteCategoryCertificate = {
  id: string;
};

export type TGetCategoryCertificate = {
  id: string;
};

export type TGetAllCategoryCertificates = {
  limit: number;
  cursor: string;
};

export type TGetAllCategoryCertificatesResponse = {
  data: TCategoryCertificate[];
  pagination: TPagination;
  status: string;
};

export type TClaimCertificate = {
  userID: string;
  categoryCertificateID: string;
};

export type TGetClaimStatus = {
  id: string;
  userID: string;
};

export type TClaimStatusQuizProgress = {
  quizID: string;
  quiz: TCategoryCertificateQuiz["quiz"];
  isCompleted: boolean;
  totalQuestions: number;
  totalAttemptedQuestions: number;
  status: string;
};

export type TClaimStatusResponse = {
  status: string;
  data: {
    certificateID: string;
    userID: string;
    claimable: boolean;
    isClaimed: boolean;
    quizProgresses: TClaimStatusQuizProgress[];
    certificate: TCategoryCertificate;
    certificateAwarded?: TCertificateAwarded;
  };
};

export type TGetAllCertificatesAwarded = {
  limit: number;
  cursor: string;
};

export type TGetCertificatesAwardedByUser = {
  userID: string;
  limit: number;
  cursor: string;
};

export type TGetAllCertificatesAwardedResponse = {
  data: TCertificateAwarded[];
  pagination: TPagination;
  status: string;
};

export type TGetCertificateAwardByUser = {
  certID: string;
  userID: string;
};

export type TCertificateAwardByUserResponse = {
  data: TCertificateAwarded;
  status: string;
};
