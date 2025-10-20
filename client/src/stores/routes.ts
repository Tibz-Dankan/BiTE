import { create } from "zustand";
import type { TCurrentPage, TCurrentPageAction } from "../types/routes";

const initialPageValues = {
  title: "",
  icon: "",
  path: "",
  element: "",
  children: [],
  showInSidebar: false,
};

export const useRouteStore = create<TCurrentPage & TCurrentPageAction>(
  (set) => ({
    currentPage: initialPageValues,
    updateCurrentPage: (currentPage) =>
      set(() => ({ currentPage: currentPage })),
    clearCurrentPage: () => set(() => ({ currentPage: initialPageValues })),
  })
);
