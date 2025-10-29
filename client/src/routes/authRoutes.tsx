import React, { Fragment } from "react";
import { Routes } from "react-router-dom";

import type { TRoute } from "../types/routes";
import { renderRoutes } from "./renderRoutes";
import { SignIn } from "../components/pages/auth/SignIn";
import { LayoutDashboard } from "lucide-react";
import { PageNotFound } from "../components/pages/common/PageNotFound";
import { SignUp } from "../components/pages/auth/SignUp";

export const AuthRoutes: React.FC = () => {
  const routes: TRoute = {
    title: "auth",
    pages: [
      {
        title: "Sign In",
        icon: "icon",
        path: "/auth/signin",
        showInSidebar: false,
        element: <SignIn />,
      },
      {
        title: "Sign Up",
        icon: "icon",
        path: "/auth/signup",
        showInSidebar: false,
        element: <SignUp />,
      },
      // Page Not Found - Wildcard Route
      {
        title: "Page Not Found",
        icon: <LayoutDashboard className="h-5 w-5" />,
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
