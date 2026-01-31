import { SERVER_URL } from "../constants/urls";
import type {
  TGetAllQuizzes,
  TGetQuizAttemptedData,
  TGetQuizDataForAttempt,
  TGetQuizUserProgressCount,
  TGetQuizzesByUserAndProgress,
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
    quizCategoryID,
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
        quizCategoryID,
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
      },
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
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  getQuizDataForAttempt = async ({
    quizID,
    limit,
    questionCursor,
  }: TGetQuizDataForAttempt) => {
    const response = await fetch(
      `${SERVER_URL}/quiz/attempt/${quizID}?limit=${limit}&questionCursor=${questionCursor}`,
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

  getQuizAttemptedData = async ({
    quizID,
    limit,
    questionCursor,
  }: TGetQuizAttemptedData) => {
    const response = await fetch(
      `${SERVER_URL}/quiz/attempted-data/${quizID}?limit=${limit}&questionCursor=${questionCursor}`,
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

  getQuizzesByUserAndProgress = async ({
    userID,
    limit,
    cursor,
    status,
    quizCategoryID,
  }: TGetQuizzesByUserAndProgress) => {
    const response = await fetch(
      `${SERVER_URL}/quiz/user/${userID}/progress?limit=${limit}&cursor=${cursor}&status=${status}&quizCategoryID=${quizCategoryID}`,
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

  getQuizUserProgressCount = async ({ userID }: TGetQuizUserProgressCount) => {
    const response = await fetch(
      `${SERVER_URL}/quiz/user/${userID}/progress/count`,
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

  duplicate = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${quizID}/duplicate`, {
      method: "POST",
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

  makeQuizAttemptable = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${quizID}/attemptable`, {
      method: "PATCH",
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

  makeQuizUnattemptable = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${quizID}/unattemptable`, {
      method: "PATCH",
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

  showQuiz = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${quizID}/show`, {
      method: "PATCH",
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

  hideQuiz = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/quiz/${quizID}/hide`, {
      method: "PATCH",
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
