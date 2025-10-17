import { useLocation } from "react-router-dom";
import type { TRoute } from "../../types/routes";
import { HelpCircle } from "lucide-react";

interface DashboardSidebarProps {
  routes: TRoute;
}

export function DashboardHeader(props: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const pages = props.routes.pages;

  const getPageTitle = () => {
    const currentPage = pages.find((page) => page.path === pathname);
    console.log({ currentPage });

    return currentPage ? currentPage.title : "";
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4
      bg-[#f0f1f3] px-4 md:px-6"
    >
      <div className="flex-1s flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold text-gray-800">
          {getPageTitle()}
        </h1>
        <div
          className="flex items-center gap-2 border-[1.5px] border-gray-700
          rounded-md p-1 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-gray-700" />
        </div>
      </div>
    </header>
  );
}
