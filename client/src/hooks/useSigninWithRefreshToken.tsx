import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth";
import { authAPI } from "../api/auth";
import type { TAuth } from "../types/auth";
import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const useSigninWithRefreshToken = () => {
  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.updateAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isTokenExpired = useCallback((token: string): boolean => {
    if (!token) return true;

    const payload = jwtDecode(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp <= currentTime;
  }, []);

  const shouldRefreshToken = useCallback((token: string): boolean => {
    if (!token) return false;

    const payload = jwtDecode(token);
    const refreshThreshold = 15 * 60 * 1000;

    if (!payload || !payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = payload.exp;
    const timeUntilExpiration = (expirationTime - currentTime) * 1000; // Convert to milliseconds

    // Token is expired or will expire within the threshold
    return timeUntilExpiration <= refreshThreshold;
  }, []);

  const { mutate } = useMutation({
    mutationFn: authAPI.signinWithRefreshToken,
    onSuccess: (auth: TAuth & { message: string }) => {
      console.log("signin with refresh token:", auth);
      updateAuth(auth);
    },
    onError: (error: any) => {
      console.error("Failed to signin with refresh token:", error.message);
      if (isTokenExpired(auth.refreshToken)) {
        clearAuth();
      }
    },
  });

  const logInWithRT = async () => {
    if (isTokenExpired(auth.accessToken)) {
      console.log("Token expired");
      mutate({ userID: auth.user.id, refreshToken: auth.refreshToken });
      return;
    }
    if (shouldRefreshToken(auth.accessToken)) {
      console.log("Token ready for refresh");
      mutate({ userID: auth.user.id, refreshToken: auth.refreshToken });
    }
  };

  return { logInWithRT };
};
