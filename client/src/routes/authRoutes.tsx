import React, { Fragment } from "react";
import { Routes } from "react-router-dom";

import type { TRoute } from "../types/routes";
import { renderRoutes } from "./renderRoutes";
import { Signin } from "../components/pages/auth/Signin";
import { LayoutDashboard } from "lucide-react";
import { PageNotFound } from "../components/pages/common/PageNotFound";

export const AuthRoutes: React.FC = () => {
  const routes: TRoute = {
    title: "auth",
    pages: [
      {
        title: "Log In",
        icon: "icon",
        path: "/auth/signin",
        showInSidebar: false,
        element: <Signin />,
      },
      // Page Not Found - Wildcard Route
      {
        title: "Page Not Found",
        icon: <LayoutDashboard className="h-5 w-5" />,
        // path: "/auth/*",
        path: "/*",
        showInSidebar: false,
        element: <PageNotFound />,
      },
    ],
  };

  return (
    <Fragment>
      <Routes>{renderRoutes(routes.pages)}</Routes>
    </Fragment>
  );
};
