import { type ReactNode } from "react";

export type TPage = {
  title: string;
  icon: ReactNode;
  path: string;
  element: ReactNode;
  children?: TPage[];
  showInSidebar: boolean;
};

export type TRoute = {
  title?: string;
  pages: TPage[];
};

export type TCurrentPage = {
  currentPage: TPage;
};

export type TCurrentPageAction = {
  updateCurrentPage: (page: TPage) => void;
  clearCurrentPage: () => void;
};
