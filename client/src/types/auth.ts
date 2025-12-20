export type TSignInInPut = {
  email: string;
  password: string;
};

export type TSignUpInPut = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type TForgotPassword = {
  email: string;
};

export type TVerifyOTP = {
  otp: string;
};

export type TResetPassword = {
  otp: string;
  password: string;
  confirmPassword?: string;
};

export type TSignWithRefreshToken = {
  userID: string;
  refreshToken: string;
};

export type TChangePassword = {
  userID: string;
  currentPassword: string;
  newPassword: string;
};

export type TUpdateUserImage = {
  userID: string;
  formData: FormData;
};

export type TLoginWithRefreshTokenInPut = {
  refreshToken: string;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  imageUrl: string;
  profileBgColor: string;
  createdAt: string;
  updatedAt: string;
};

export type TAuth = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TAuthState = {
  auth: TAuth;
};

export type TAuthActions = {
  updateAuth: (auth: TAuth) => void;
  clearAuth: () => void;
};
