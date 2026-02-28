import { SERVER_URL } from "../constants/urls";
import {
  type SatsReward,
  type SatsRewardAddress,
  type SatsClaimQuiz,
  type SatsRewardStats,
} from "../types/satsReward";
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

export interface SatsClaimQuizResponse {
  status: string;
  message: string;
  data: SatsClaimQuiz[];
  pagination: TPagination;
}

export interface SatsRewardStatsResponse {
  status: string;
  message: string;
  data: SatsRewardStats;
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

  getClaimableQuizzes = async ({
    userID,
    limit = 10,
    cursor = "",
  }: {
    userID: string;
    limit?: number;
    cursor?: string;
  }): Promise<SatsClaimQuizResponse> => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/user/${userID}/quizzes?limit=${limit}&cursor=${cursor}`,
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

  claimQuizReward = async ({
    quizID,
  }: {
    quizID: string;
  }): Promise<{ status: string; message: string }> => {
    const response = await fetch(`${SERVER_URL}/satsreward/claim-quiz`, {
      method: "POST",
      body: JSON.stringify({ quizID }),
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

  getUserStats = async ({
    userID,
  }: {
    userID: string;
  }): Promise<SatsRewardStatsResponse> => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/user/${userID}/stats`,
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

  updateAddress = async ({ id, address }: { id: string; address: string }) => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/address/${id}/edit`,
      {
        method: "PATCH",
        body: JSON.stringify({ address }),
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

  makeDefaultAddress = async ({ id }: { id: string }) => {
    const response = await fetch(
      `${SERVER_URL}/satsreward/address/${id}/default`,
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
