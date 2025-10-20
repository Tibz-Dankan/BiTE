import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TCurrentPage, TCurrentPageAction } from "../types/routes";

const initialPageValues = {
  title: "",
  icon: "",
  path: "",
  element: "",
  children: [],
  showInSidebar: false,
};

export const useRouteStore = create<TCurrentPage & TCurrentPageAction>()(
  persist(
    (set) => ({
      currentPage: initialPageValues,
      updateCurrentPage: (currentPage) =>
        set(() => ({
          currentPage: {
            ...currentPage,
            // Store everything except React elements
            children: [],
            icon: "",
            element: "",
          },
        })),
      clearCurrentPage: () => set(() => ({ currentPage: initialPageValues })),
    }),
    {
      name: "current-page",
      storage: createJSONStorage(() => localStorage),
      // Optional: you can specify which parts of the state to persist
      partialize: (state) => ({ currentPage: state.currentPage }),
      // Optional: skip hydration on SSR
      skipHydration: false,
    }
  )
);
