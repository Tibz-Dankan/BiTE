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
