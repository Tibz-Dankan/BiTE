import type { TUser } from "./auth";
import type { TLocation } from "./location";

export type TSession = {
  id: string;
  userID: string;
  accessToken: string;
  refreshToken: string;
  generatedVia: string;
  device: string;
  locationID: string;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
  location?: TLocation;
};

export type TAdminUser = TUser & {
  correctQuestionAttemptCount: number;
  country: string;
  dateOfBirth: string;
  gender: string;
  imagePath: string;
  lastLocation: TLocation | null;
  lastSession: TSession | null;
  profileBgColor: string;
  questionAttemptCount: number;
  rank: number;
  scorePercentage: number;
  siteVisitsCount: number;
  totalAttemptDuration: number;
  totalSessionsCount: number;
  userQuizAttemptCount: number;
};

export type TUserResponse = {
  data: TAdminUser[];
  message: string;
  pagination: {
    count: number;
    hasNextItems: boolean;
    limit: number;
    nextCursor: string;
  };
  status: string;
};
