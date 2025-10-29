import { SERVER_URL } from "../constants/urls";
import type {
  TChangePassword,
  TForgotPassword,
  TResetPassword,
  TSignInInPut,
  TSignUpInPut,
  TUpdateUserImage,
  TUser,
  TVerifyOTP,
} from "../types/auth";

class AuthAPI {
  signIn = async ({ email, password }: TSignInInPut) => {
    const response = await fetch(`${SERVER_URL}/user/auth/signin`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
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

  signUp = async ({ name, email, password }: TSignUpInPut) => {
    const response = await fetch(`${SERVER_URL}/user/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
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

  forgotPassword = async ({ email }: TForgotPassword) => {
    const response = await fetch(`${SERVER_URL}/user/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({
        email,
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

  verifyOTP = async ({ otp }: TVerifyOTP) => {
    const response = await fetch(`${SERVER_URL}/user/auth/verify-otp`, {
      method: "PATCH",
      body: JSON.stringify({
        otp,
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

  resetPassword = async ({ password, otp }: TResetPassword) => {
    const response = await fetch(
      `${SERVER_URL}/user/auth/reset-password/${otp}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          password,
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

  changePassword = async ({
    userID,
    currentPassword,
    newPassword,
  }: TChangePassword) => {
    const response = await fetch(
      `${SERVER_URL}/user/user/${userID}/auth/change-password`,
      {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
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

  updateUserImage = async ({ userID, formData }: TUpdateUserImage) => {
    const response = await fetch(`${SERVER_URL}/user/${userID}/image`, {
      method: "PATCH",
      body: formData,
      // headers: {
      //   "Content-type": "multipart/form-data",
      // },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  };

  updateUser = async (user: TUser) => {
    const response = await fetch(`${SERVER_URL}/user/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify(user),
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

export const authAPI = new AuthAPI();
