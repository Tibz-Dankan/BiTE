import type React from "react";
import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";

import type { TRoute } from "../../types/routes";
import { Button } from "../ui/button";
import { useAuthStore } from "../../stores/auth";

interface DashboardSidebarProps {
  routes: TRoute;
}

export function DashboardHeader(props: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const auth = useAuthStore((state) => state.auth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const pages = props.routes.pages;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Leave Request Approved",
      description: "Your leave request for 12th-15th June has been approved.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "New Document Uploaded",
      description: "HR has uploaded a new policy document for your review.",
      time: "Yesterday",
      read: false,
    },
    {
      id: 3,
      title: "Payslip Available",
      description: "Your May 2023 payslip is now available for download.",
      time: "3 days ago",
      read: true,
    },
  ]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearchOpen(value.length > 0);
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsSearchOpen(false);
    };

    if (isSearchOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isSearchOpen]);

  const getPageTitle = () => {
    const currentPage = pages.find((page) => page.path === pathname);
    console.log({ currentPage });

    // return currentPage?.title!;
    return "";
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const logOutHandler = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-[#f0f1f3] px-4 md:px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:justify-end">
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pages, people, applications..."
              className="w-64 rounded-lg bg-white pl-8 md:w-80 lg:w-96"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setIsSearchOpen(true)}
            />
          </form>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer p-4"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        notification.read ? "bg-transparent" : "bg-primary"
                      }`}
                    />
                    <div className="grid gap-1">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {notification.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center">
              <span className="text-sm font-medium">
                View all notifications
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/judiciary-logo.png" alt="User" />
                <AvatarFallback>{"JH"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{auth.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/profile-settings", { replace: true })}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <div className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logOutHandler()}
                >
                  Log out
                </Button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
