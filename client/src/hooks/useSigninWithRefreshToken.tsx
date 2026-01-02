import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth";
import { authAPI } from "../api/auth";
import type { TAuth } from "../types/auth";
import { useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const useSigninWithRefreshToken = () => {
  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.updateAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

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
    const timeUntilExpiration = (expirationTime - currentTime) * 1000;

    return timeUntilExpiration <= refreshThreshold;
  }, []);

  const { mutate } = useMutation({
    mutationFn: authAPI.signinWithRefreshToken,
    onSuccess: (auth: TAuth & { message: string }) => {
      updateAuth(auth);
    },
    onError: (error: any) => {
      console.error("Failed to signin with refresh token:", error.message);
      if (isTokenExpired(auth.refreshToken)) {
        clearAuth();
        navigate("/auth/signin", { replace: true });
      }
    },
  });

  useEffect(() => {
    const logInWithRT = async (auth: TAuth) => {
      if (!auth.refreshToken || !auth.accessToken) return;

      if (isTokenExpired(auth.accessToken)) {
        mutate({ userID: auth.user.id, refreshToken: auth.refreshToken });
        return;
      }
      if (shouldRefreshToken(auth.accessToken)) {
        mutate({ userID: auth.user.id, refreshToken: auth.refreshToken });
      }
    };

    logInWithRT(auth);

    const intervalId = setInterval(() => {
      logInWithRT(auth);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [auth, isTokenExpired, mutate, shouldRefreshToken]);
};
