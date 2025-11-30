import { SERVER_URL } from "../constants/urls";
import type {
  TGetAllQuizzes,
  TUpdateQuiz,
  TUpdateQuizAttachment,
} from "../types/quiz";

class QuizAPI {
  post = async ({ formData }: { formData: FormData }) => {
    const response = await fetch(`${SERVER_URL}/quiz`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  update = async ({
    id,
    title,
    titleDelta,
    titleHTML,
    introduction,
    introductionDelta,
    introductionHTML,
    postedByUserID,
    startsAt,
    endsAt,
    instructions,
    instructionsDelta,
    instructionsHTML,
  }: TUpdateQuiz) => {
    const response = await fetch(`${SERVER_URL}/quiz/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        titleDelta,
        titleHTML,
        introduction,
        introductionDelta,
        introductionHTML,
        postedByUserID,
        startsAt,
        endsAt,
        instructions,
        instructionsDelta,
        instructionsHTML,
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

  updateQuizAttachment = async ({
    quizID,
    attachmentID,
    formData,
  }: TUpdateQuizAttachment) => {
    const response = await fetch(
      `${SERVER_URL}/quiz/${quizID}/attachment/${attachmentID}`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: "",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  getByID = async ({ id }: { id: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${id}`, {
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

  getAll = async ({ limit, cursor, quizCategoryID }: TGetAllQuizzes) => {
    const response = await fetch(
      `${SERVER_URL}/quiz?limit=${limit}&cursor=${cursor}&quizCategoryID=${quizCategoryID}`,
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

  search = async ({ query }: { query: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/search?query=${query}`, {
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

  getAnalytics = async () => {
    const response = await fetch(`${SERVER_URL}/quiz/analytics/summary`, {
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

  delete = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${quizID}`, {
      method: "DELETE",
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

export const quizAPI = new QuizAPI();
