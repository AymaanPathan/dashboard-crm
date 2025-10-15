"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
  href,
}) => {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={`
        flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "bg-white shadow-sm border border-gray-100"
            : "hover:bg-gray-50 hover:shadow-sm"
        }
      `}
        style={
          isActive
            ? {
                boxShadow:
                  "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
              }
            : undefined
        }
      >
        <div
          className={`h-4 w-4 flex items-center justify-center ${
            isActive ? "text-emerald-600" : "text-gray-500"
          }`}
        >
          {icon}
        </div>

        <span
          className={`text-xs font-medium flex-1 ${
            isActive ? "text-gray-900" : "text-gray-600"
          }`}
        >
          {label}
        </span>

        <ChevronRight
          className={`h-3.5 w-3.5 transition-transform text-gray-400 `}
        />
      </div>
    </Link>
  );
};

export default NavItem;
