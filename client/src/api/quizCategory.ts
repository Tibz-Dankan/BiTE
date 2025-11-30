import { SERVER_URL } from "../constants/urls";

import type {
  TGetAllQuizCategories,
  TGetQuizCategory,
  TUpdateQuizCategory,
} from "../types/quizCategory";

class QuizCategoryAPI {
  post = async ({ formData }: { formData: FormData }) => {
    const response = await fetch(`${SERVER_URL}/quizcategory`, {
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

  update = async ({ id, name }: TUpdateQuizCategory) => {
    const response = await fetch(`${SERVER_URL}/quizcategory/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
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

  getByID = async ({ id }: TGetQuizCategory) => {
    const response = await fetch(`${SERVER_URL}/quizcategory/${id}`, {
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

  getAll = async ({ limit, cursor }: TGetAllQuizCategories) => {
    const response = await fetch(
      `${SERVER_URL}/quizcategory?limit=${limit}&cursor=${cursor}`,
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

  delete = async ({ quizID: quizCategoryID }: { quizID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/quizcategory/${quizCategoryID}`,
      {
        method: "DELETE",
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

export const quizCategoryAPI = new QuizCategoryAPI();
