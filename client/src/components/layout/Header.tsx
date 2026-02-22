import { Link, useLocation, useNavigate } from "react-router-dom";
import type { TRoute } from "../../types/routes";
import { Gift, HelpCircle, Menu, Plus, X } from "lucide-react";
import { useSidebarStore } from "../../stores/sidebar";
import { removeColonsFromPath } from "../../utils/removeColonsFromPath";
import { useRouteStore } from "../../stores/routes";
import { Button } from "../ui/shared/Btn";
import { useAuthStore } from "../../stores/auth";
import { matchPath } from "react-router-dom";
import { QuizTimer } from "../ui/quiz/QuizTimer";
import { useFeatureFlagEnabled } from "@posthog/react";

interface DashboardSidebarProps {
  routes: TRoute;
}

export function DashboardHeader(props: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pages = props.routes.pages;
  const currentPageFromStore = useRouteStore((state) => state.currentPage);
  const auth = useAuthStore((state) => state.auth);
  const isSatsRewardEnabled = useFeatureFlagEnabled("sats-reward");

  const isOpenSidebar = useSidebarStore((state) => state.isOpen);
  const OpenSidebar = useSidebarStore((state) => state.openSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  const isAdmin = auth.user.role === "ADMIN";

  const rewardPath = isAdmin ? "/a/rewards" : "/u/rewards";

  const getPageTitle = () => {
    const currentPage = pages.find(
      (page) => removeColonsFromPath(page.path) === pathname,
    );

    const hasCurrentPageFromRoutes = !!currentPage?.title;
    return hasCurrentPageFromRoutes
      ? currentPage?.title
      : currentPageFromStore.title;
  };

  const navigateToNewQuizPage = () => {
    navigate("/a/quizzes/new");
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4
      px-4 md:px-6"
    >
      <div className="flex-1s flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center lg:hidden">
            <img
              src="/images/bite-logo.png"
              alt="BiTE Logo"
              width={40}
              height={40}
              className="rounded"
            />
          </div>
          <h1
            className="text-lg font-semibold text-gray-800
            hidden lg:inline-block"
          >
            {getPageTitle()}
          </h1>
        </div>
        <div className="flex items-center justify-end gap-4">
          {(() => {
            const match = matchPath("/u/quizzes/:quizID/attempt", pathname);
            if (match && match.params.quizID) {
              return <QuizTimer quizID={match.params.quizID} />;
            }
            return null;
          })()}
          {isAdmin && (
            <div className="w-full flex items-center justify-end">
              <Button
                type="button"
                className="bg-(--primary) text-[12px] h-auto px-3 py-[6px]"
                onClick={() => navigateToNewQuizPage()}
              >
                <Plus className="w-4 h-4 text-gray-50 -ml-[2px] mr-1" />
                <span className="text-gray-50 font-semibold">New Quiz</span>
              </Button>
            </div>
          )}
          {isSatsRewardEnabled && (
            <Link
              to={rewardPath}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700 text-sm">Rewards</span>
            </Link>
          )}
          <div
            className="flex items-center gap-2 border-[1.5px] border-gray-700
            rounded-md p-1 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-gray-700" />
          </div>
          <div className="flex items-center gap-4 lg:hidden">
            {isOpenSidebar && (
              <span
                onClick={() => closeSidebar()}
                className="inline-block cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-700" />
              </span>
            )}
            {!isOpenSidebar && (
              <span
                onClick={() => OpenSidebar()}
                className="inline-block cursor-pointer"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
