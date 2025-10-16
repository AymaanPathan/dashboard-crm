import React from "react";
import Link from "next/link";

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  href: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  isActive,
  href,
  badge,
}) => {
  return (
    <Link href={`/crm/${href}`}>
      <div
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer group relative ${
          isActive
            ? "bg-gray-100 text-black"
            : "hover:bg-gray-50 text-gray-600" 
        }`}
      >
        <div className="relative">
          <div
            className={`transition-colors ${
              isActive
                ? "text-black"
                : "text-gray-500 group-hover:text-gray-700"
            }`}
          >
            {icon}
          </div>
          {badge !== undefined && badge > 0 && (
            <span className="absolute text-center -top-1.5 -right-2 flex items-center justify-center w-[16px] h-[16px] bg-red-500 text-white text-[8px] font-bold rounded-full border-2 border-white">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </div>
        <span
          className={`text-xs font-medium transition-colors flex-1 ${
            isActive ? "text-black" : "text-gray-600 group-hover:text-gray-900"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default NavItem;
