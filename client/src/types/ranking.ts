import type { TPagination } from "./pagination";
import type { TUser } from "./auth";

export interface TRanking {
  id: string;
  userID: string;
  totalDuration: number;
  totalAttempts: number;
  totalCorrectAttempts: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
  user: TUser;
}

export interface TRankingResponse {
  data: TRanking[];
  message: string;
  pagination: TPagination;
  status: string;
}
