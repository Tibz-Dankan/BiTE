import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth";
import { jwtDecode } from "jwt-decode";
import { Home, LogIn, LayoutDashboard } from "lucide-react";
import { SCNButton } from "../../ui/shared/button";

export const PageNotFound: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);

  const isTokenExpired = (token: string): boolean => {
    if (!token) return true;
    try {
      const payload = jwtDecode(token);
      if (!payload || !payload.exp) return true;
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime;
    } catch {
      return true;
    }
  };

  const hasValidRefreshToken =
    !!auth.refreshToken && !isTokenExpired(auth.refreshToken);
  const dashboardPath =
    auth.user.role === "ADMIN" ? "/a/dashboard" : "/u/dashboard";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Oops! The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {hasValidRefreshToken ? (
          <SCNButton asChild size="lg" className="gap-2">
            <Link to={dashboardPath}>
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          </SCNButton>
        ) : (
          <>
            <SCNButton asChild size="lg" className="gap-2">
              <Link to="/auth/signin">
                <LogIn size={18} />
                Sign In
              </Link>
            </SCNButton>
            <SCNButton asChild variant="outline" size="lg" className="gap-2">
              <Link to="/">
                <Home size={18} />
                Go Home
              </Link>
            </SCNButton>
          </>
        )}
      </div>
    </div>
  );
};
