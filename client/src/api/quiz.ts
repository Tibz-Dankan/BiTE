import { SERVER_URL } from "../constants/urls";
import type { UpdateQuiz, UpdateQuizAttachment } from "../types/quiz";

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
    postedByUserID,
    startsAt,
    endsAt,
    instructions,
  }: UpdateQuiz) => {
    const response = await fetch(`${SERVER_URL}/quiz/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        postedByUserID,
        startsAt,
        endsAt,
        instructions,
      }),
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
  }: UpdateQuizAttachment) => {
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

  getAll = async () => {
    const response = await fetch(`${SERVER_URL}/quiz`, {
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
