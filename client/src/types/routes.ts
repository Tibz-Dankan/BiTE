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
