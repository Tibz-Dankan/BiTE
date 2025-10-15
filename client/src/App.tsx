import React, { Fragment } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { NotificationInitializer } from "./components/ui/NotificationInitializer";
import { useAuthStore } from "./stores/auth";
import { AuthRoutes } from "./routes/authRoutes";
import { CommonRoutes } from "./routes/commonRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AdminRoutes } from "./routes/adminRoutes";

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
              <Route path="/auth/*" element={<AuthRoutes />} />
              <Route
                path="/auth/signin"
                element={<Navigate to="/auth/signin" replace />}
              />
              <Route path="/*" element={<CommonRoutes />} />
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </Fragment>
        )}

        {isLoggedInUser && (
          <Fragment>
            <Routes>
              {/* <Route path="/u/*" element={<UserRoutes />} /> */}
              {/* <Route
                path="*"
                element={<Navigate to="/u/dashboard" replace />}
                /> */}
              <Route path="/u/*" element={<UserRoutes />} />
            </Routes>
          </Fragment>
        )}

        {isLoggedInAdmin && (
          <Fragment>
            <Routes>
              <Route path="/a/*" element={<AdminRoutes />} />
              {/* <Route
                path="*"
                element={<Navigate to="/a/dashboard" replace />}
              /> */}
            </Routes>
          </Fragment>
        )}
      </BrowserRouter>
    </div>
  );
};
