import { SERVER_URL } from "../constants/urls";
import type { TRankingResponse } from "../types/ranking";

class RankingAPI {
  getUsersWithRanks = async (
    limit: number = 20,
    cursor: string = ""
  ): Promise<TRankingResponse> => {
    const url = new URL(`${SERVER_URL}/ranking/users`);
    url.searchParams.append("limit", limit.toString());
    if (cursor) {
      url.searchParams.append("cursor", cursor);
    }

    const response = await fetch(url.toString(), {
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
}

export const rankingAPI = new RankingAPI();
