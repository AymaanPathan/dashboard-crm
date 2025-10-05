"use client";
import React from "react";
import { LogOut, Home, Users, Bell } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Page } from "@/enums/page.enum";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { CustomButton } from "@/components/Buttons/Button";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const todayTaskCount = useSelector(
    (state: RootState) => state.leadTasks.todayTaskCount
  );
  const logout = useLogout();

  const getVariant = (page: Page) =>
    pathname.includes(page.toLowerCase()) ? "secondary" : "ghost";

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="h-14 px-6 flex items-center justify-between max-w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <span className="text-sm font-semibold text-gray-900">CRM</span>
          <span className="text-sm font-semibold text-gray-400">Flow</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link href="/crm/dashboard">
            <CustomButton
              variant={getVariant(Page.DASHBOARD)}
              className="h-7 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </CustomButton>
          </Link>

          <Link href="/crm/people">
            <CustomButton
              variant={getVariant(Page.PEOPLE)}
              className="h-7 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Users className="mr-2 h-4 w-4" />
              People
            </CustomButton>
          </Link>

          <Link href="/crm/templates">
            <CustomButton
              variant={getVariant(Page.TEMPLATES)}
              className="h-7 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Users className="mr-2 h-4 w-4" />
              Templates
            </CustomButton>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 min-w-[140px] justify-end">
          <Link href="/crm/tasks">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 cursor-pointer w-8 p-0 hover:bg-gray-100 rounded-md"
              >
                <Bell className="w-4 h-4 text-gray-600" />
              </Button>
              {todayTaskCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                  {todayTaskCount > 99 ? "99" : todayTaskCount}
                </div>
              )}
            </div>
          </Link>
          <div className="w-px h-4 bg-gray-200" />

          <CustomButton
            onClick={logout}
            variant={getVariant(Page.TEMPLATES)}
            className="h-7 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
