import { SERVER_URL } from "../constants/urls";

class AttemptDurationAPI {
  get = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/attemptduration/quiz/${quizID}`,
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

  update = async ({
    quizID,
    userID,
    duration,
  }: {
    quizID: string;
    userID: string;
    duration: number;
  }) => {
    const response = await fetch(
      `${SERVER_URL}/attemptduration/quiz/${quizID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          userID,
          duration,
        }),
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

export const attemptDurationAPI = new AttemptDurationAPI();
