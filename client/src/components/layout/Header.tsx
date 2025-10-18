import { useLocation } from "react-router-dom";
import type { TRoute } from "../../types/routes";
import { HelpCircle, Menu, X } from "lucide-react";
import { useSidebarStore } from "../../stores/sidebar";

interface DashboardSidebarProps {
  routes: TRoute;
}

export function DashboardHeader(props: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const pages = props.routes.pages;

  const isOpenSidebar = useSidebarStore((state) => state.isOpen);
  const OpenSidebar = useSidebarStore((state) => state.openSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  const getPageTitle = () => {
    const currentPage = pages.find((page) => page.path === pathname);
    console.log({ currentPage });

    return currentPage ? currentPage.title : "";
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
