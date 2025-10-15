import React, { Fragment } from "react";
import { Outlet, Routes } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";

import type { TRoute } from "../types/routes";
import { renderRoutes } from "./renderRoutes";
import { DashboardLayout } from "../components/layout/Dashboard";
import { PageNotFound } from "../components/pages/common/PageNotFound";

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
        title: "Staff Management",
        icon: <Users className="h-5 w-5" />,
        path: "/u/dashboard/children-route",
        showInSidebar: true,
        element: (
          <div className="w-full flex items-center justify-center">
            <Outlet />
          </div>
        ),
        children: [
          {
            title: "Children route here",
            icon: <Users className="h-5 w-5" />,
            path: "/u/dashboard/children-route/1",
            showInSidebar: true,
            element: <div>child route here</div>,
          },
        ],
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
      <DashboardLayout routes={routes}>
        <Routes>{renderRoutes(routes.pages)}</Routes>
      </DashboardLayout>
    </Fragment>
  );
};
