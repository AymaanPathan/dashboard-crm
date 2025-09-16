"use client";
import React from "react";
import { LogOut, Home, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Page } from "@/enums/page.enum";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const todayTaskCount = useSelector(
    (state: RootState) => state.leadTasks.todayTaskCount
  );
  const logout = useLogout();

  const getVariant = (page: Page) =>
    pathname.includes(page.toLowerCase()) ? "default" : "ghost";

  return (
    <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              CRM
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Flow
            </span>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 items-center justify-center space-x-2">
            <nav className="flex items-center space-x-1">
              <Link href="/crm/dashboard">
                <Button
                  variant={getVariant(Page.DASHBOARD)}
                  size="sm"
                  className="h-8"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/crm/people">
                <Button
                  variant={getVariant(Page.PEOPLE)}
                  size="sm"
                  className="h-8"
                >
                  <Users className="mr-2 h-4 w-4" />
                  People
                </Button>
              </Link>
            </nav>
          </div>

          {/* Notifications & Logout */}
          <div className="flex items-center space-x-2">
            <Link href="/crm/tasks">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100"
                >
                  <Bell className="w-4 h-4 text-gray-600" />
                </Button>
                {todayTaskCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5">
                    {todayTaskCount > 99 ? "99+" : todayTaskCount}
                  </div>
                )}
              </div>
            </Link>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="h-9 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 text-gray-700 shadow-sm font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
