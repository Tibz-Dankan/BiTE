import React, { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { NotificationInitializer } from "./components/ui/NotificationInitializer";
import { useAuthStore } from "./stores/auth";
import { AuthRoutes } from "./routes/authRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
import { Home } from "./components/ui/Home";

export const App: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const isLoggedIn = !!auth.accessToken;
  const isLoggedInUser = isLoggedIn && auth.user.role === "USER";
  const isLoggedInAdmin = isLoggedIn && auth.user.role === "ADMIN";

  return (
    <div className="bg-(--clr-background)  min-h-screen overflow-x-hidden">
      <BrowserRouter>
        <NotificationInitializer />
        {!isLoggedIn && (
          <Fragment>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<AuthRoutes />} />
            </Routes>
          </Fragment>
        )}

        {isLoggedInUser && (
          <Fragment>
            <Routes>
              <Route path="/*" element={<UserRoutes />} />
            </Routes>
          </Fragment>
        )}

        {isLoggedInAdmin && (
          <Fragment>
            <Routes>
              <Route path="/*" element={<AdminRoutes />} />
            </Routes>
          </Fragment>
        )}
      </BrowserRouter>
    </div>
  );
};
