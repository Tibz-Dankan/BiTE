import type { TUser } from "./auth";
import type { TQuiz } from "./quiz";

export type SatsRewardAddress = {
  id: string;
  userID: string;
  address: string;
  isVerified: boolean;
  isDefault: boolean;
  info: any;
  createdAt: string;
  updatedAt: string;
  user?: TUser;
};

export type SatsRewardTransaction = {
  id: string;
  satsRewardID: string;
  transaction: any; // Contains settlementAmount (base64 encoded often)
  rewardedQuestionIDs: string[];
  createdAt: string;
  updatedAt: string;
};

export type SatsRewardOperation = {
  id: string;
  satsRewardID: string;
  status: "SUCCESS" | "FAIL";
  info: string;
  createdAt: string;
  updatedAt: string;
};

export type SatsReward = {
  id: string;
  userID: string;
  quizID: string;
  satsRewardAddressID: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  user?: TUser;
  quiz?: TQuiz;
  satsRewardAddress?: SatsRewardAddress;
  satsRewardTransactions?: SatsRewardTransaction[];
  satsRewardOperations?: SatsRewardOperation[];
};
