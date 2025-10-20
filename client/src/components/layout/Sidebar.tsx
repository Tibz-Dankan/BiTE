import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ChevronDown, LogOut, PanelLeft, Settings } from "lucide-react";

import type { TPage, TRoute } from "../../types/routes";
import { cn } from "../../utils/classname";
import { useAuthStore } from "../../stores/auth";
import { getFirstWord } from "../../utils/getFirstWord";
import { truncateString } from "../../utils/truncateString";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useSidebarStore } from "../../stores/sidebar";
import { useGetWindowWidth } from "../../hooks/useGetWindowWidth";
import { useRouteStore } from "../../stores/route";

interface DashboardSidebarProps {
  routes: TRoute;
}

const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

export function DashboardSidebar(props: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const auth = useAuthStore((state) => state.auth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const isOpenSidebar = useSidebarStore((state) => state.isOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const pages: TPage[] = props.routes.pages;
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { width } = useGetWindowWidth();

  const isAdminAccount = auth.user.role === "ADMIN";
  const isUserAccount = auth.user.role === "USER";

  const isSubmenuActive = (items: TPage[]): boolean => {
    return items.some((item) => {
      if (item.path !== "#" && pathname === item.path) {
        return true;
      }
      if (item.children) {
        return isSubmenuActive(item.children);
      }
      return false;
    });
  };

  const closeSidebarOnMobile = () => {
    if (width < 1024) {
      closeSidebar();
    }
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const renderSubmenu = (items: TPage[], parentTitle: string) => {
    const submenuItems = [];
    for (let subindex = 0; subindex < items.length; subindex++) {
      const subitem = items[subindex];
      const submenuKey = `${parentTitle}-${subitem.title}`;
      const isActive = pathname === subitem.path;
      const hasActiveChild = subitem.children
        ? isSubmenuActive(subitem.children)
        : false;
      const shouldHighlight =
        isActive || hasActiveChild || openSubmenus.includes(submenuKey);
      const hasChildren = !!subitem.children && subitem.children?.length > 0;

      if (!subitem.showInSidebar) {
        continue;
      }

      if (hasChildren) {
        submenuItems.push(
          <div key={subindex}>
            <button
              onClick={() => toggleSubmenu(submenuKey)}
              className={cn(
                `flex w-full items-center justify-between rounded-md px-3
                 py-2 text-sm font-medium transition-colors`,
                shouldHighlight
                  ? "bg-primary/10 text-(--primary) font-semibold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className="flex items-center">
                <span
                  className={cn(
                    "mr-3",
                    shouldHighlight ? "text-(--primary)" : "text-gray-500"
                  )}
                >
                  {subitem.icon}
                </span>
                <span>{subitem.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openSubmenus.includes(submenuKey) && "rotate-180",
                  shouldHighlight ? "text-(--primary)" : "text-gray-500"
                )}
              />
            </button>
            {openSubmenus.includes(submenuKey) &&
              renderSubmenu(subitem.children!, submenuKey)}
          </div>
        );
      }

      if (!hasChildren) {
        submenuItems.push(
          <Link
            key={subindex}
            to={subitem.path}
            className={cn(
              `flex items-center rounded-md px-3 py-2 text-sm font-medium
               transition-colors`,
              isActive
                ? "bg-primary/10 text-(--primary) font-semibold"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
            onClick={() => {
              closeSidebarOnMobile(), updateCurrentPage(subitem);
            }}
          >
            <span
              className={cn(
                "mr-3",
                isActive ? "text-(--primary)" : "text-gray-500"
              )}
            >
              {subitem.icon}
            </span>
            <span>{subitem.title}</span>
          </Link>
        );
      }
    }

    return <div className="mt-1 ml-6 space-y-1">{submenuItems}</div>;
  };

  const logOutHandler = () => {
    clearAuth();
    navigate("/auth/signin", { replace: true });
  };

  const buildDropdownLink = (path: string) => {
    if (isAdminAccount) {
      return `/a/${path}`;
    }
    if (isUserAccount) {
      return `/u/${path}`;
    }
    return `/${path}`;
  };

  return (
    <aside
      className={`fixed z-[120] top-12 lg:top-0 left-0 h-[calc(100vh-64px)] lg:h-screen
         w-screen lg:w-64 p-3 transition-transform  duration-300 lg:translate-x-0
       ${
         isOpenSidebar
           ? "translate-x-0"
           : "-translate-x-[100vw] lg:-translate-x-64"
       }`}
    >
      <div
        className="w-full h-full flex flex-col
        bg-white z-50 rounded-xl shadow-sm lg:shadow-sm"
      >
        <div className="w-full p-3 hidden lg:flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/bite-logo.png"
              alt="BiTE Logo"
              width={40}
              height={40}
              className="rounded"
            />
          </div>
          <div>
            <span>
              <PanelLeft className="w-4 h-4 text-gray-700" />
            </span>
          </div>
        </div>

        {/* User Account first name */}
        <div className="w-full relative z-10 px-3 pt-3 lg:pt-0">
          <div
            className="flex items-center gap-3 px-3 py-3 bg-gray-800/5
            rounded-md border-b-[2px] border-orange-300"
          >
            <div
              className="flex-shrink-0 h-6 w-6 rounded-md bg-orange-300
             flex items-center justify-center pt-1"
            >
              {
                <span className="text-[12px] font-medium text-orange-600">
                  {auth.user.name.charAt(0).toUpperCase()}
                </span>
              }
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {getFirstWord(auth.user.name)}
              </p>
            </div>
          </div>
        </div>

        <div
          className="w-full relative z-10 flex-1 overflow-y-auto py-4 px-3
          my-scrollbar scrollbar-thin scrollbar-thumb-gray-300
          scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
        >
          <nav className="space-y-1">
            {pages.map((item, index) => {
              const submenuKey = item.title;
              const isActive = pathname === item.path;
              const hasActiveChild = item.children
                ? isSubmenuActive(item.children)
                : false;
              const shouldHighlight =
                isActive || hasActiveChild || openSubmenus.includes(submenuKey);

              return (
                <div key={index}>
                  {item.children && item.showInSidebar && (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(submenuKey)}
                        className={cn(
                          `flex w-full items-center justify-between rounded-md px-3 
                           py-3 text-sm font-normal transition-colors`,
                          shouldHighlight
                            ? "bg-primary/20 text-(--primary) font-normal"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center">
                          <span
                            className={cn(
                              "mr-3",
                              shouldHighlight
                                ? "text-(--primary)"
                                : "text-gray-500"
                            )}
                          >
                            {item.icon}
                          </span>
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openSubmenus.includes(submenuKey) && "rotate-180",
                            shouldHighlight
                              ? "text-(--primary)"
                              : "text-gray-500"
                          )}
                        />
                      </button>
                      {openSubmenus.includes(submenuKey) &&
                        renderSubmenu(item.children!, submenuKey)}
                    </div>
                  )}

                  {!item.children && item.showInSidebar && (
                    <Link
                      key={index}
                      to={item.path}
                      className={cn(
                        `flex items-center rounded-md px-3 py-2 text-sm font-normal 
                         transition-colors`,
                        isActive
                          ? "bg-(--primary)/15 text-(--primary) font-normal"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      onClick={() => {
                        closeSidebarOnMobile(), updateCurrentPage(item);
                      }}
                    >
                      <span
                        className={cn(
                          "mr-3",
                          isActive ? "text-(--primary)" : "text-gray-500"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="relative z-10 p-4 space-y-2">
          {isAdminAccount && (
            <div
              className="w-full text-center border-[1px] border-gray-300
              rounded-md px-2 py-1 pb-2"
            >
              <span className="text-[12px] text-gray-500">Admin Account</span>
            </div>
          )}

          <Menu as="div" className="w-full relative inline-block text-left">
            <div>
              <MenuButton
                className="inline-flex w-full justify-center items-center gap-x-1.5 
                rounded-md bg-transparent text-sm font-semibold
                text-color-text-primary relative"
              >
                <div className="w-full relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-shrink-0 h-8 w-8 rounded-full flex 
                      items-center justify-center"
                      style={{ backgroundColor: auth.user.profileBgColor }}
                    >
                      {
                        <span className="font-medium text-white">
                          {auth.user.name.charAt(0).toUpperCase()}
                        </span>
                      }
                    </div>
                    <div>
                      <p className="text-sm text-start font-medium text-gray-800">
                        {truncateString(auth.user.name, 18)}
                      </p>
                      <p
                        className="text-[10px] text-start text-gray-500 flex items-center 
                        gap-1 font-normal"
                      >
                        {truncateString(auth.user.email, 25)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </MenuButton>
            </div>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                className="absolute bottom-10 -left-1 z-10 mt-2 w-52
                divide-y divide-gray-200 rounded-md bg-white shadow-lg 
                focus:outline-none border-[1px] border-gray-200"
              >
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        to={buildDropdownLink("dashboard")}
                        className={classNames(
                          focus ? "bg-gray-200" : "",
                          "block px-4 py-2 text-sm text-gray-500"
                        )}
                      >
                        <div className="w-full">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex-shrink-0 h-8 w-8 rounded-full flex 
                              items-center justify-center"
                              style={{
                                backgroundColor: auth.user.profileBgColor,
                              }}
                            >
                              {
                                <span className="font-medium text-white">
                                  {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                              }
                            </div>
                            <div>
                              <p className="text-sm text-start font-medium text-gray-800">
                                {truncateString(auth.user.name, 18)}
                              </p>
                              <p
                                className="text-[10px] text-start text-gray-500 flex 
                                items-center gap-1"
                              >
                                {truncateString(auth.user.role, 10)}
                              </p>
                            </div>
                          </div>
                          <div className="w-full">
                            <p
                              className="text-[12px] text-start text-gray-500
                              flex items-center gap-1"
                            >
                              {truncateString(auth.user.email, 25)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        to={buildDropdownLink("settings")}
                        className={classNames(
                          focus ? "bg-gray-200" : "",
                          "block px-4 py-2 text-sm text-gray-500 hover:text-gray-800"
                        )}
                      >
                        <div className="flex items-center justify-start gap-2">
                          <span>
                            <Settings className="h-4 w-4" />
                          </span>
                          <span>Account settings</span>
                        </div>
                      </Link>
                    )}
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => logOutHandler()}
                        className={classNames(
                          focus ? "bg-gray-200" : "",
                          `flex items-center gap-2 text-sm font-medium text-gray-500
                           hover:text-gray-800 w-full px-4 py-2 cursor-pointer`
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
    </aside>
  );
}
