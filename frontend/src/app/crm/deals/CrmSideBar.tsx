"use client";
import React, { useState, useEffect } from "react";
import {
  LogOut,
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  FileText,
  BarChart3,
  Users,
  Grid3x3,
  Sparkles,
  ShoppingCart,
  Menu,
  X,
  Settings,
  Bell,
  User,
  Quote,
  CreditCard,
  DollarSign,
} from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import NavItem from "@/components/crmSideBar/NavItems";

const CrmNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const todayTaskCount = useSelector(
    (state: RootState) => state.leadTasks.todayTaskCount
  );
  const handleLogout = useLogout();
  const getIsActive = (page: string) => pathname.includes(page.toLowerCase());

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <>
      {/* Logo Header */}
      <div
        className="h-14 px-4 flex items-center justify-between border-b shrink-0"
        style={{ borderColor: "rgba(229, 229, 229, 0.3)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              CRM FLOW
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              CRM Management
            </span>
          </div>
        </div>
        <button className="hidden md:block p-1 hover:bg-gray-100 rounded transition-colors">
          <Grid3x3 className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button
          className="md:hidden p-1 hover:bg-gray-100 rounded transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        <nav className="px-3 space-y-2 pb-4 ">
          {/* Favorites Section */}

          <div className=" mx-2 mb-3 "></div>

          <div>
            <NavItem
              label="Dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              isActive={getIsActive("dashboard")}
              href="dashboard"
            />
          </div>

          <div>
            <NavItem
              label="Deals"
              icon={<Briefcase className="h-4 w-4" />}
              isActive={getIsActive("deals")}
              href="deals"
            />
          </div>
          <div>
            <NavItem
              label="people"
              icon={<User className="h-4 w-4" />}
              isActive={getIsActive("people")}
              href="people"
            />
          </div>

          <div>
            <NavItem
              label="Tasks"
              icon={<CheckSquare className="h-4 w-4" />}
              isActive={getIsActive("tasks")}
              href="tasks"
            />
          </div>

          {/* Quotations Section */}
          <div>
            <NavItem
              label="Quotations"
              icon={<FileText className="h-4 w-4" />}
              isActive={getIsActive("quotations")}
              href="quotations"
            />
          </div>

          <div>
            <NavItem
              label="Orders"
              icon={<ShoppingCart className="h-4 w-4" />}
              isActive={getIsActive("orders")}
              href="orders"
            />
          </div>

          <div>
            <NavItem
              label="Customers"
              icon={<Users className="h-4 w-4" />}
              isActive={getIsActive("customers")}
              href="customers"
            />
          </div>

          <div>
            <NavItem
              label="Payments"
              icon={<CreditCard className="h-4 w-4" />}
              isActive={getIsActive("payments")}
              href="payments"
            />
          </div>
          <div>
            <NavItem
              label="finance"
              icon={<DollarSign className="h-4 w-4" />}
              isActive={getIsActive("finance")}
              href="finance"
            />
          </div>
          <div>
            <NavItem
              label="Notifications"
              icon={<Bell className="h-4 w-4" />}
              isActive={getIsActive("notifications")}
              href="notifications"
              badge={todayTaskCount}
            />
          </div>
        </nav>
        <div className="border-t mx-2 border-gray-200"></div>
      </div>

      {/* Bottom Section */}
      <div
        className="px-3 py-3 border-t shrink-0"
        style={{ borderColor: "rgba(229, 229, 229, 0.3)" }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-100 group mb-2">
          <Settings
            className="h-4 w-4 text-gray-500 transition-colors"
            strokeWidth={2.5}
          />
          <span className="text-xs font-medium text-gray-600 transition-colors flex-1">
            Settings
          </span>
          <span className="text-gray-400">›</span>
        </div>

        <div
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-red-50 group"
        >
          <LogOut
            className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors"
            strokeWidth={2.5}
          />
          <span className="text-xs font-medium text-gray-600 group-hover:text-red-600 transition-colors">
            Logout
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-60 z-40">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 backdrop-blur-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 252, 252, 0.95) 100%)",
              borderRight: "1px solid rgba(229, 229, 229, 0.4)",
              boxShadow: "2px 0 16px rgba(0, 0, 0, 0.02)",
            }}
          />
        </div>
        <div className="relative h-full flex flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed left-0 top-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 backdrop-blur-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 252, 252, 0.95) 100%)",
              borderRight: "1px solid rgba(229, 229, 229, 0.4)",
              boxShadow: "2px 0 16px rgba(0, 0, 0, 0.02)",
            }}
          />
        </div>
        <div className="relative h-full flex flex-col">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default CrmNavbar;
