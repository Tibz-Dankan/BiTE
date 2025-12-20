import React from "react";
import { useSigninWithRefreshToken } from "../../../hooks/useSigninWithRefreshToken";

export const InitSignInWithRefreshToken: React.FC = () => {
  useSigninWithRefreshToken();
  return <div />;
};
