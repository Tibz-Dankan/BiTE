import type { TUser } from "./auth";
import type { SatsRewardAddress } from "./satsReward";
import type { TPagination } from "./pagination";

export type TChessSolverColor = "white" | "black";

export type TChessDifficulty =
  | "easiest"
  | "easier"
  | "normal"
  | "harder"
  | "hardest";

export type TChessUserRating = {
  rating: number;
  ratingDeviation: number;
  volatility?: number;
  gamesPlayed: number;
  provisional: boolean;
  lastPlayedAt?: string | null;
};

export type TChessPuzzleNext = {
  puzzleId: string;
  fen: string;
  setupMove: string;
  solverColor: TChessSolverColor;
  plyCount: number;
  popularity: number;
  nbPlays: number;
  themes: string[];
  gameUrl: string;
  userRating: TChessUserRating;
};

export type TChessMoveValidation = {
  correct: boolean;
  opponentReply: string | null;
  solved: boolean;
};

export type TChessAttemptRatingChange = {
  before: number;
  after: number;
  diff: number;
  ratingDeviation: number;
  provisional: boolean;
};

export type TChessRoundOutcome = "ATTEMPTED" | "WATCHED_SOLUTION";

export type TChessAttemptResult = {
  win: boolean;
  clean: boolean;
  outcome: TChessRoundOutcome;
  satsEarned: number;
  userRating: TChessAttemptRatingChange;
  puzzleRating: { before: number; after: number };
  solution: string[];
};

// Request payloads
export type TChessValidateMoveInput = {
  puzzleId: string;
  ply: number;
  uci: string;
};

export type TChessSubmitAttemptInput = {
  puzzleId: string;
  win: boolean;
  timeMs: number;
  moves: string[];
  mistakes: number;
};

// Response envelopes
export type TChessPuzzleNextResponse = {
  status: string;
  message: string;
  data: TChessPuzzleNext;
};

export type TChessUserRatingResponse = {
  status: string;
  message: string;
  data: TChessUserRating;
};

export type TChessMoveValidationResponse = {
  status: string;
  message: string;
  data: TChessMoveValidation;
};

export type TChessAttemptResultResponse = {
  status: string;
  message: string;
  data: TChessAttemptResult;
};

export type TChessPuzzleSatsReward = {
  id: string;
  userID: string;
  chessPuzzleID: string;
  satsRewardAddressID: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  transaction?: string | { settlementAmount: number } | null;
  info?: string;
  createdAt: string;
  updatedAt: string;
  user?: TUser;
  satsRewardAddress?: SatsRewardAddress;
};

export type TChessPuzzleSatsRewardResponse = {
  status: string;
  message: string;
  data: TChessPuzzleSatsReward[];
  pagination: TPagination;
};

// A solved puzzle whose sats have not been paid out yet. `id` is the round id
// (React key and pagination cursor); `chessPuzzleID` is what the claim sends.
export type TChessClaimPuzzle = {
  id: string;
  userID: string;
  chessPuzzleID: string;
  satsEarned: number;
  solvedAt: string;
  win: boolean;
  clean: boolean;
  rating?: number;
  themes?: string[];
  gameUrl?: string;
};

export type TChessClaimPuzzleResponse = {
  status: string;
  message: string;
  data: TChessClaimPuzzle[];
  pagination: TPagination;
};
