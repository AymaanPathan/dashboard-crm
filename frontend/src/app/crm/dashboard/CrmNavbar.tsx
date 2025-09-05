"use client";
import React from "react";
import { LogOut, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { RootDispatch } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";
import { Page } from "@/enums/page.enum";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [currentPageState, setCurrentPageState] = React.useState(
    Page.DASHBOARD
  );
  const dispatch: RootDispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                CRM
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Flow
              </span>
            </div>
          </div>

          {/* Navigation Links - Middle */}
          <div className="flex flex-1 items-center justify-center space-x-2">
            <nav className="flex items-center space-x-1">
              <Link href="/crm/dashboard">
                <Button
                  onClick={() => setCurrentPageState(Page.DASHBOARD)}
                  variant={
                    currentPageState === Page.DASHBOARD ? "default" : "ghost"
                  }
                  size="sm"
                  className="h-8"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/crm/people">
                <Button
                  onClick={() => setCurrentPageState(Page.PEOPLE)}
                  variant={
                    currentPageState === Page.PEOPLE ? "default" : "ghost"
                  }
                  size="sm"
                  className="h-8"
                >
                  <Users className="mr-2 h-4 w-4" />
                  People
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            <Link href="/">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="h-9 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 text-gray-700 shadow-sm font-medium transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
