import { SERVER_URL } from "../constants/urls";
import type { TPostAttempt } from "../types/attempt";

class AttemptAPI {
  post = async ({
    userID,
    questionID,
    answerIDList,
    answerInput,
  }: TPostAttempt) => {
    const response = await fetch(`${SERVER_URL}/attempt`, {
      method: "POST",
      body: JSON.stringify({
        userID: userID,
        questionID: questionID,
        answerIDList: JSON.stringify(answerIDList),
        answerInput: answerInput,
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

export const attemptAPI = new AttemptAPI();
