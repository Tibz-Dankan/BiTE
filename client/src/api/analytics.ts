import { SERVER_URL } from "../constants/urls";
import type { TAdminAnalytics, TUserAnalytics } from "../types/quiz";

class AnalyticsAPI {
  getAdmin = async (): Promise<TAdminAnalytics> => {
    const response = await fetch(`${SERVER_URL}/analytics/admin`, {
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

  getUser = async (): Promise<TUserAnalytics> => {
    const response = await fetch(`${SERVER_URL}/analytics/user`, {
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

export const analyticsAPI = new AnalyticsAPI();
