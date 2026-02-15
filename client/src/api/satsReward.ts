import { SERVER_URL } from "../constants/urls";
import { type SatsReward, type SatsRewardAddress } from "../types/satsReward";
import { type TPagination } from "../types/pagination";

export interface SatsRewardResponse {
  status: string;
  message: string;
  data: SatsReward[];
  pagination: TPagination;
}

export interface SatsRewardAddressResponse {
  status: string;
  message: string;
  data: SatsRewardAddress[];
  pagination: TPagination;
}

class SatsRewardAPI {
  getAll = async ({
    limit = 10,
    cursor = "",
  }: {
    limit?: number;
    cursor?: string;
  }): Promise<SatsRewardResponse> => {
    const response = await fetch(
      `${SERVER_URL}/satsreward?limit=${limit}&cursor=${cursor}`,
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

  getAllByUser = async ({
    userID,
    limit = 10,
    cursor = "",
  }: {
    userID: string;
    limit?: number;
    cursor?: string;
  }): Promise<SatsRewardResponse> => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/user/${userID}?limit=${limit}&cursor=${cursor}`,
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

  getAddressesByUser = async ({
    userID,
    limit = 10,
    cursor = "",
  }: {
    userID: string;
    limit?: number;
    cursor?: string;
  }): Promise<SatsRewardAddressResponse> => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/address/user/${userID}?limit=${limit}&cursor=${cursor}`,
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

  postAddress = async ({
    userID,
    address,
  }: {
    userID: string;
    address: string;
  }) => {
    const response = await fetch(`${SERVER_URL}/satsreward/address`, {
      method: "POST",
      body: JSON.stringify({
        userID,
        address,
      }),
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

  verifyAddress = async ({ address }: { address: string }) => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/address/${address}/verify`,
      {
        method: "PATCH",
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
}

export const satsRewardAPI = new SatsRewardAPI();
