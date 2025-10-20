import React, { Fragment } from "react";
import { Routes } from "react-router-dom";
import { FileQuestion, LayoutDashboard, Settings, XCircle } from "lucide-react";

import type { TRoute } from "../types/routes";
import { renderRoutes } from "./renderRoutes";
import { DashboardLayout } from "../components/layout/Dashboard";
import { PageNotFound } from "../components/pages/common/PageNotFound";
import { AdminQuizView } from "../components/pages/quiz/AdminQuizView";
import { AdminQuizUpdate } from "../components/pages/quiz/AdminQuizUpdate";

export const AdminRoutes: React.FC = () => {
  const routes: TRoute = {
    title: "Admin",
    pages: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        path: "/a/dashboard",
        showInSidebar: true,
        element: <div>Admin Dashboard content</div>,
      },
      {
        title: "Quizzes",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes",
        showInSidebar: true,
        element: <AdminQuizView />,
      },
      {
        title: "Edit Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID",
        showInSidebar: false,
        element: <AdminQuizUpdate />,
      },
      {
        title: "Settings",
        icon: <Settings className="h-4 w-4" />,
        path: "/a/settings",
        showInSidebar: true,
        element: <div>Admin Settings</div>,
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
