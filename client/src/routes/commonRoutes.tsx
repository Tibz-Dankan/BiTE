import React, { Fragment } from "react";
import { Routes } from "react-router-dom";
import type { TRoute } from "../types/routes";
import { Home } from "../components/ui/Home";
import { renderRoutes } from "./renderRoutes";
import { LayoutDashboard } from "lucide-react";
import { PageNotFound } from "../components/pages/common/PageNotFound";

export const CommonRoutes: React.FC = () => {
  const routes: TRoute = {
    title: "Common",
    pages: [
      {
        title: "Home",
        icon: "Home",
        path: "/",
        showInSidebar: false,
        element: <Home />,
      },

      // Page Not Found - Wildcard Route
      {
        title: "Page Not Found",
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: "/*",
        showInSidebar: true,
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
