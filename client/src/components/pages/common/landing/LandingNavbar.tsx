import React from "react";
import { SCNButton } from "../../../ui/shared/button";
import { Link } from "react-router-dom";
import { useFeatureFlagEnabled } from "@posthog/react";
import { useAuthStore } from "../../../../stores/auth";
import { jwtDecode } from "jwt-decode";
import { Gift } from "lucide-react";

export const LandingNavbar: React.FC = () => {
  const isSatsRewardEnabled = useFeatureFlagEnabled("sats-reward");
  const auth = useAuthStore((state) => state.auth);
  const isLoggedIn = !!auth.accessToken;

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

  const rewardsPath = isLoggedIn ? "/u/rewards" : "/rewards";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/images/bite-logo.png"
            alt="BiTE Logo"
            className="h-8 w-auto drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-[oklch(0.749_0.154_70.67)] to-purple-600 bg-clip-text text-transparent tracking-tight">
            BiTE
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-purple-600 transition-colors">
            Overview
          </Link>

          <a
            href="/#mission"
            className="hover:text-purple-600 transition-colors"
          >
            Mission
          </a>
          <a
            href="/#curriculum"
            className="hover:text-purple-600 transition-colors"
          >
            Curriculum
          </a>
          {isSatsRewardEnabled && (
            <Link
              to={rewardsPath}
              className="hover:text-purple-600 transition-colors"
            >
              Rewards
            </Link>
          )}
        </div>

        <div className="md:hidden">
          {isSatsRewardEnabled && (
            <Link
              to={rewardsPath}
              className="hover:text-purple-600 transition-colors"
            >
              <Gift className="w-6 h-6 text-(--primary)" />
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        {!hasValidRefreshToken && (
          <div className="flex items-center gap-3">
            <Link
              to="/auth/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <SCNButton
              asChild
              size="sm"
              className="rounded-full shadow-md shadow-purple-100"
            >
              <Link to="/auth/signup">Get Started</Link>
            </SCNButton>
          </div>
        )}

        {/* Dashboard Button */}
        {hasValidRefreshToken && (
          <div className="flex items-center gap-3">
            <SCNButton
              asChild
              size="sm"
              className="rounded-lg shadow-md shadow-purple-100 bg-(--primary)
               text-(--primary-foreground) px-4"
            >
              <Link to={dashboardPath}>Dashboard</Link>
            </SCNButton>
          </div>
        )}
      </div>
    </nav>
  );
};
