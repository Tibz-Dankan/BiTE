import React, { Fragment } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { NotificationInitializer } from "./components/ui/shared/NotificationInitializer";
import { useAuthStore } from "./stores/auth";
import { AuthRoutes } from "./routes/authRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
// import { Home } from "./components/ui/shared/Home";
import { useGlobalRequestInterceptor } from "./hooks/use-global-request-interceptor";
import { PageCapturer } from "./components/ui/shared/PageCapturer";
import { LandingPage } from "./components/pages/common/LandingPage";

export const App: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const isLoggedIn = !!auth.accessToken;
  const isLoggedInUser = isLoggedIn && auth.user.role === "USER";
  const isLoggedInAdmin = isLoggedIn && auth.user.role === "ADMIN";

  useGlobalRequestInterceptor();

  return (
    <div className="bg-(--clr-background)  min-h-screen overflow-x-hidden">
      <BrowserRouter>
        <NotificationInitializer />
        <PageCapturer />
        {!isLoggedIn && (
          <Fragment>
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/*" element={<AuthRoutes />} />
            </Routes>
          </Fragment>
        )}

        {isLoggedInUser && (
          <Fragment>
            <Routes>
              <Route path="/*" element={<UserRoutes />} />
              <Route
                path="/"
                element={<Navigate to="/u/dashboard" replace />}
              />
            </Routes>
          </Fragment>
        )}

        {isLoggedInAdmin && (
          <Fragment>
            <Routes>
              <Route path="/*" element={<AdminRoutes />} />
              <Route
                path="/"
                element={<Navigate to="/a/dashboard" replace />}
              />
            </Routes>
          </Fragment>
        )}
      </BrowserRouter>
    </div>
  );
};
