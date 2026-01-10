import { SERVER_URL } from "../constants/urls";
import type { TUserResponse } from "../types/user";

class UserAPI {
  getAll = async (
    limit: number = 20,
    cursor: string = ""
  ): Promise<TUserResponse> => {
    const response = await fetch(
      `${SERVER_URL}/user?limit=${limit}&cursor=${cursor}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };
}

export const userAPI = new UserAPI();
