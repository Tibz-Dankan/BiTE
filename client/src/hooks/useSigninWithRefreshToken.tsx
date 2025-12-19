import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth";
import { authAPI } from "../api/auth";
import type { TAuth } from "../types/auth";
// import { useCallback } from "react";

export const useSigninWithRefreshToken = () => {
  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.updateAuth);

  const { mutate } = useMutation({
    mutationFn: authAPI.signinWithRefreshToken,
    onSuccess: (auth: TAuth & { message: string }) => {
      console.log("signin with refresh token:", auth);
      updateAuth(auth);
    },
    onError: (error: any) => {
      console.error("Failed to signin with refresh token:", error.message);
    },
  });

  //     const isTokenExpired = useCallback((token: string): boolean => {
  //     if (!token) return true;

  //     const payload = jwtDecode(token);
  //     if (!payload || !payload.exp) return true;

  //     const currentTime = Math.floor(Date.now() / 1000);
  //     return payload.exp <= currentTime;
  //   }, []);

  //     const shouldRefreshToken = useCallback(
  //     (token: string): boolean => {
  //       if (!token) return false;

  //       const payload = jwtDecode(token);

  //       if (!payload || !payload.exp) return false;

  //       const currentTime = Math.floor(Date.now() / 1000);
  //       const expirationTime = payload.exp;
  //       const timeUntilExpiration = (expirationTime - currentTime) * 1000; // Convert to milliseconds

  //       // Token is expired or will expire within the threshold
  //       return timeUntilExpiration <= refreshThreshold;
  //     },
  //     [refreshThreshold]
  //   );

  const logInWithRT = async () => {
    mutate({ userID: auth.user.id, refreshToken: auth.refreshToken });
  };

  return { logInWithRT };
};
