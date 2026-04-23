import { SERVER_URL } from "../constants/urls";

class AIPreviewAPI {
  postByQuiz = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(`${SERVER_URL}/aipreview/quiz/${quizID}`, {
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

  checkExistsByQuiz = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/aipreview/quiz/${quizID}/exists`,
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

  showAllByQuiz = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/question/quiz/${quizID}/show-ai-preview`,
      {
        method: "PATCH",
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

  hideAllByQuiz = async ({ quizID }: { quizID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/question/quiz/${quizID}/hide-ai-preview`,
      {
        method: "PATCH",
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

  showByQuestion = async ({ questionID }: { questionID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/question/${questionID}/show-ai-preview`,
      {
        method: "PATCH",
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

  hideByQuestion = async ({ questionID }: { questionID: string }) => {
    const response = await fetch(
      `${SERVER_URL}/question/${questionID}/hide-ai-preview`,
      {
        method: "PATCH",
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

  makeDefault = async ({ id }: { id: string }) => {
    const response = await fetch(`${SERVER_URL}/aipreview/${id}/default`, {
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

  update = async ({ id, prompt }: { id: string; prompt?: string }) => {
    const response = await fetch(`${SERVER_URL}/aipreview/${id}`, {
      method: "PUT",
      body: JSON.stringify({ prompt }),
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

  post = async ({ questionID }: { questionID: string }) => {
    const response = await fetch(`${SERVER_URL}/aipreview`, {
      method: "POST",
      body: JSON.stringify({ questionID }),
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

export const aiPreviewAPI = new AIPreviewAPI();
