import { SERVER_URL } from "../constants/urls";
import type { TPostSiteVisit } from "../types/siteVisit";

class SiteVisitAPI {
  post = async ({ page, path, capturedAt }: TPostSiteVisit) => {
    const response = await fetch(`${SERVER_URL}/sitevisit`, {
      method: "POST",
      body: JSON.stringify({
        page: page,
        path: path,
        capturedAt: capturedAt,
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
}

export const siteVisitAPI = new SiteVisitAPI();
