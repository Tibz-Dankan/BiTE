import { SERVER_URL } from "../constants/urls";
import type {
  TGetAllQuestionsByQuiz,
  TSearchQuestion,
  TUpdateQuestion,
  TUpdateQuestionAttachment,
} from "../types/question";

class QuestionAPI {
  post = async ({ formData }: { formData: FormData }) => {
    const response = await fetch(`${SERVER_URL}/question`, {
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
    quizID,
    postedByUserID,
    sequenceNumber,
    hasMultipleCorrectAnswers,
    requiresNumericalAnswer,
  }: TUpdateQuestion) => {
    const response = await fetch(`${SERVER_URL}/question/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        titleDelta,
        titleHTML,
        introduction,
        introductionDelta,
        introductionHTML,
        quizID,
        postedByUserID,
        sequenceNumber,
        hasMultipleCorrectAnswers,
        requiresNumericalAnswer,
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

  updateQuestionAttachment = async ({
    questionID,
    attachmentID,
    formData,
  }: TUpdateQuestionAttachment) => {
    const response = await fetch(
      `${SERVER_URL}/question/${questionID}/attachment/${attachmentID}`,
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
    const response = await fetch(`${SERVER_URL}/question/${id}`, {
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

  getAllByQuiz = async ({ quizID, limit, cursor }: TGetAllQuestionsByQuiz) => {
    const response = await fetch(
      `${SERVER_URL}/question/quiz/${quizID}?limit=${limit}&cursor=${cursor}`,
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

  search = async ({ query, quizID }: TSearchQuestion) => {
    const response = await fetch(
      `${SERVER_URL}/question/search?query=${query}&quizID=${quizID}`,
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

  delete = async ({ id }: { id: string }) => {
    const response = await fetch(`${SERVER_URL}/question/${id}`, {
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

export const questionAPI = new QuestionAPI();
