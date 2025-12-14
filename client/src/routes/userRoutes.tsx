import React, { Fragment } from "react";
import { Routes } from "react-router-dom";
import { FileQuestion, LayoutDashboard, Settings, XCircle } from "lucide-react";

import type { TRoute } from "../types/routes";
import { renderRoutes } from "./renderRoutes";
import { DashboardLayout } from "../components/layout/Dashboard";
import { PageNotFound } from "../components/pages/common/PageNotFound";
import { UserQuizView } from "../components/pages/quiz/UserQuizView";
import { UserQuizAttempt } from "../components/pages/quiz/UserQuizAttempt";
import { UserQuizResultPage } from "../components/pages/quiz/UserQuizResultPage";

export const UserRoutes: React.FC = () => {
  const routes: TRoute = {
    title: "User",
    pages: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: "/u/dashboard",
        showInSidebar: true,
        element: <div>User Dashboard content</div>,
      },
      {
        title: "Quizzes",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/u/quizzes",
        showInSidebar: true,
        element: <UserQuizView />,
      },
      {
        title: "Quiz Attempt",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/u/quizzes/:quizID/attempt",
        showInSidebar: false,
        element: <UserQuizAttempt />,
      },
      {
        title: "Quiz Results",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/u/quizzes/:quizID/results",
        showInSidebar: false,
        element: <UserQuizResultPage />,
      },
      {
        title: "Settings",
        icon: <Settings className="h-4 w-4" />,
        path: "/u/settings",
        showInSidebar: true,
        element: <div>User Settings</div>,
      },

      // Page Not Found - Wildcard Route
      {
        title: "Page Not Found",
        icon: <XCircle className="h-4 w-4" />,
        path: "/*",
        showInSidebar: false,
        element: <PageNotFound />,
      },
    ],
  };
  return (
    <Fragment>
      <DashboardLayout routes={routes}>
        <Routes>{renderRoutes(routes.pages)}</Routes>
      </DashboardLayout>
    </Fragment>
  );
};
