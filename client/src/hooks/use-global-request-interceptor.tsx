import { useEffect } from "react";
import { SERVER_URL } from "../constants/urls";
import { useAuthStore } from "../stores/auth";

export const useGlobalRequestInterceptor = () => {
  const auth = useAuthStore((state) => state.auth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const fetchInterceptorHandler = () => {
      const originalFetch = globalThis.fetch;

      globalThis.fetch = async (...args) => {
        // Don't process the request if it doesn't contain server url
        if (!args[0].toString().startsWith(SERVER_URL)) {
          return await originalFetch(...args);
        }

        console.log("auth.accessToken :", auth.accessToken);

        const headers: any = args[1]?.headers;
        if (!headers.Authorization) {
          headers.Authorization = `Bearer ${auth.accessToken}`;
        }

        args[1]!["headers"] = headers;

        const response = await originalFetch(...args);
        console.log(`API Call: ${args[0]} | Status Code: ${response.status}`);

        return response;
      };
    };

    fetchInterceptorHandler();
  }, [auth.accessToken, auth.refreshToken, clearAuth]);
};
