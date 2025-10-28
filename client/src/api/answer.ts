import { SERVER_URL } from "../constants/urls";
import type { TUpdateAnswer, TUpdateAnswerAttachment } from "../types/answer";

class AnswerAPI {
  post = async ({ formData }: { formData: FormData }) => {
    const response = await fetch(`${SERVER_URL}/answer`, {
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
    questionID,
    sequenceNumber,
    isCorrect,
  }: TUpdateAnswer) => {
    const response = await fetch(`${SERVER_URL}/answer/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        postedByUserID,
        questionID,
        sequenceNumber,
        isCorrect,
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

  updateAnswerAttachment = async ({
    answerID,
    attachmentID,
    formData,
  }: TUpdateAnswerAttachment) => {
    console.log("answerID: ", answerID);
    console.log("attachmentID: ", attachmentID);
    const response = await fetch(
      `${SERVER_URL}/answer/${answerID}/attachment/${attachmentID}`,
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

  getAllByQuestion = async ({ questionID }: { questionID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/answer/question/${questionID}`,
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
}

export const answerAPI = new AnswerAPI();
