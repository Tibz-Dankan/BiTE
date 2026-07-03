import { SERVER_URL } from "../constants/urls";
import {
  type TChessDifficulty,
  type TChessPuzzleNextResponse,
  type TChessUserRatingResponse,
  type TChessMoveValidationResponse,
  type TChessAttemptResultResponse,
  type TChessValidateMoveInput,
  type TChessSubmitAttemptInput,
} from "../types/chessPuzzle";

class ChessPuzzleAPI {
  getNext = async ({
    difficulty = "normal",
    puzzleId,
  }: {
    difficulty?: TChessDifficulty;
    puzzleId?: string;
  }): Promise<TChessPuzzleNextResponse> => {
    const params = new URLSearchParams({ difficulty });
    if (puzzleId) params.set("puzzleId", puzzleId);

    const response = await fetch(
      `${SERVER_URL}/chesspuzzle/next?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  getRating = async (): Promise<TChessUserRatingResponse> => {
    const response = await fetch(`${SERVER_URL}/chesspuzzle/rating`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  validateMove = async (
    input: TChessValidateMoveInput,
  ): Promise<TChessMoveValidationResponse> => {
    const response = await fetch(`${SERVER_URL}/chesspuzzle/move`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  submitAttempt = async (
    input: TChessSubmitAttemptInput,
  ): Promise<TChessAttemptResultResponse> => {
    const response = await fetch(`${SERVER_URL}/chesspuzzle/attempt`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };
}

export const chessPuzzleAPI = new ChessPuzzleAPI();
