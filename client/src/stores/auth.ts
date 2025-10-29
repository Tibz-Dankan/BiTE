import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TAuth, TAuthActions, TAuthState } from "../types/auth";

export type AuthStore = TAuthState & TAuthActions;

const initialAuthValues: TAuth = {
  user: {
    id: "",
    name: "",
    role: "USER",
    email: "",
    imageUrl: "",
    profileBgColor: "",
    createdAt: "",
    updatedAt: "",
  },
  accessToken: "",
  refreshToken: "",
};

export const initAuthStore = (): TAuthState => {
  return {
    auth: initialAuthValues,
  };
};

export const defaultInitState: TAuthState = {
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
