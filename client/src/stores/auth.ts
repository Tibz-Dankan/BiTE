import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthActions, AuthState } from "../types/auth";

export type AuthStore = AuthState & AuthActions;

const initialAuthValues = {
  user: {
    id: 0,
    name: "",
    role: "",
    email: "",
    imageUrl: "",
    profileBgColor: "",
    createdAt: "",
    updatedAt: "",
  },
  accessToken: "",
  refreshToken: "",
};

export const initAuthStore = (): AuthState => {
  return {
    auth: initialAuthValues,
  };
};

export const defaultInitState: AuthState = {
  auth: initialAuthValues,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      auth: initialAuthValues,
      updateAuth: (auth) => set(() => ({ auth: auth })),
      clearAuth: () => set(() => ({ auth: initialAuthValues })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Optional: you can specify which parts of the state to persist
      partialize: (state) => ({ auth: state.auth }),
      // Optional: skip hydration on SSR
      skipHydration: false,
    }
  )
);
