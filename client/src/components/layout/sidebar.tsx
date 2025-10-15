import type React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ChevronDown, LogOut, User } from "lucide-react";
import type { TPage, TRoute } from "../../types/routes";
import { cn } from "../../utils/classname";
import { useAuthStore } from "../../stores/auth";

function formatRoleName(role: string): React.ReactNode {
  if (!role) return "Unknown Role";
  // Convert camelCase or snake_case or kebab-case to Title Case
  const formatted = role
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to space
    .replace(/[_-]/g, " ") // snake_case or kebab-case to space
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word
  return formatted;
}

interface DashboardSidebarProps {
  routes: TRoute;
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const auth = useAuthStore((state) => state.auth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const pages: TPage[] = props.routes.pages;

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

  // const getActiveMenuPath = (items: TPage[], parentKey = ""): string[] => {
  //   const activePath: string[] = [];
  //   for (const item of items) {
  //     const currentKey = parentKey ? `${parentKey}-${item.title}` : item.title;
  //     if (item.path !== "#" && pathname === item.path) {
  //       activePath.push(currentKey);
  //       return activePath;
  //     }
  //     if (item.children) {
  //       const childPath = getActiveMenuPath(item.children, currentKey);
  //       if (childPath.length > 0) {
  //         activePath.push(currentKey);
  //         activePath.push(...childPath);
  //         return activePath;
  //       }
  //     }
  //   }
  //   return activePath;
  // };

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
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className="flex items-center">
                <span
                  className={cn(
                    "mr-3",
                    shouldHighlight ? "text-primary" : "text-gray-500"
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
                  shouldHighlight ? "text-primary" : "text-gray-500"
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
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <span
              className={cn(
                "mr-3",
                isActive ? "text-primary" : "text-gray-500"
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
    navigate("/auth/login", { replace: true });
  };

  return (
    <div
      className="fixed top-0 left-0 h-screen w-[240px] flex flex-col
       border-r bg-white z-50"
    >
      <div className="relative z-10 p-[13.8px] border-b flex items-center">
        <img
          src="/images/judiciary-logo.png"
          alt="Judiciary of Uganda Logo"
          width={36}
          height={36}
          className="rounded"
        />
        <span className="ml-2 font-bold text-gray-800 text-base">
          Judiciary HRM
        </span>
      </div>

      {/* User info section */}
      <div className="relative z-10 p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div
            className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100
            flex items-center justify-center"
          >
            {auth?.user?.name ? (
              <span className="font-medium text-purple-600">
                {auth?.user?.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="h-4 w-4 text-purple-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {auth?.user?.name}
            </p>
            <p className="text-xs text-gray-600">
              {formatRoleName(auth.user.role)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto py-4 px-3 my-scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
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
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(submenuKey)}
                      className={cn(
                        `flex w-full items-center justify-between rounded-md px-3 
                         py-3 text-sm font-medium transition-colors`,
                        shouldHighlight
                          ? "bg-primary/20 text-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "mr-3",
                            shouldHighlight ? "text-primary" : "text-gray-500"
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
                          shouldHighlight ? "text-primary" : "text-gray-500"
                        )}
                      />
                    </button>
                    {openSubmenus.includes(submenuKey) &&
                      renderSubmenu(item.children!, submenuKey)}
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    className={cn(
                      `flex items-center rounded-md px-3 py-2 text-sm font-medium 
                      transition-colors`,
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <span
                      className={cn(
                        "mr-3",
                        isActive ? "text-primary" : "text-gray-500"
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

      <div className="relative z-10 border-t p-4">
        <button
          onClick={() => logOutHandler()}
          className="flex items-center text-sm font-medium text-gray-600
           hover:text-gray-900 w-full"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
