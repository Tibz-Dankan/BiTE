import { SERVER_URL } from "../constants/urls";

import type {
  TPostCategoryCertificate,
  TDeleteCategoryCertificate,
  TGetCategoryCertificate,
  TGetAllCategoryCertificates,
  TUpdateCategoryCertificate,
  TPatchCategoryCertificate,
  TClaimCertificate,
  TGetClaimStatus,
  TGetAllCertificatesAwarded,
  TGetCertificatesAwardedByUser,
  TGetCertificateAwardByUser,
} from "../types/categoryCertificate";

class CategoryCertificateAPI {
  post = async ({ quizCategoryID }: TPostCategoryCertificate) => {
    const response = await fetch(`${SERVER_URL}/certificate`, {
      method: "POST",
      body: JSON.stringify({ quizCategoryID }),
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

  getByID = async ({ id }: TGetCategoryCertificate) => {
    const response = await fetch(`${SERVER_URL}/certificate/${id}`, {
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

  getAll = async ({ limit, cursor }: TGetAllCategoryCertificates) => {
    const response = await fetch(
      `${SERVER_URL}/certificate?limit=${limit}&cursor=${cursor}`,
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

  update = async ({ id, quizCategoryID }: TUpdateCategoryCertificate) => {
    const response = await fetch(`${SERVER_URL}/certificate/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quizCategoryID }),
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

  patch = async ({ id, quizCategoryID }: TPatchCategoryCertificate) => {
    const response = await fetch(`${SERVER_URL}/certificate/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ quizCategoryID }),
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

  delete = async ({ id }: TDeleteCategoryCertificate) => {
    const response = await fetch(`${SERVER_URL}/certificate/${id}`, {
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

  claim = async ({ userID, categoryCertificateID }: TClaimCertificate) => {
    const response = await fetch(`${SERVER_URL}/certificate/claim`, {
      method: "POST",
      body: JSON.stringify({ userID, categoryCertificateID }),
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

  getClaimStatus = async ({ id, userID }: TGetClaimStatus) => {
    const response = await fetch(
      `${SERVER_URL}/certificate/${id}/claim-status/user/${userID}`,
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

  getAllAwards = async ({ limit, cursor }: TGetAllCertificatesAwarded) => {
    const response = await fetch(
      `${SERVER_URL}/certificate/awards?limit=${limit}&cursor=${cursor}`,
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

  getAwardsByUser = async ({
    userID,
    limit,
    cursor,
  }: TGetCertificatesAwardedByUser) => {
    const response = await fetch(
      `${SERVER_URL}/certificate/awards/user/${userID}?limit=${limit}&cursor=${cursor}`,
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
  getAwardByUser = async ({ certID, userID }: TGetCertificateAwardByUser) => {
    const response = await fetch(
      `${SERVER_URL}/certificate/${certID}/awards/user/${userID}`,
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
}

export const categoryCertificateAPI = new CategoryCertificateAPI();
