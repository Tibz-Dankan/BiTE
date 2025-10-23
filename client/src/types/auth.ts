export type SigninInPut = {
  email: string;
  password: string;
};

export type SignupInPut = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPassword = {
  email: string;
};

export type VerifyOTP = {
  otp: string;
};

export type ResetPassword = {
  otp: string;
  password: string;
};

export type ChangePassword = {
  userID: string;
  currentPassword: string;
  newPassword: string;
};

export type UpdateUserImage = {
  userID: string;
  formData: FormData;
};

export type LoginWithRefreshTokenInPut = {
  refreshToken: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  imageUrl: string;
  profileBgColor: string;
  createdAt: string;
  updatedAt: string;
};

export type Auth = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  auth: Auth;
};

export type AuthActions = {
  updateAuth: (auth: Auth) => void;
  clearAuth: () => void;
};
