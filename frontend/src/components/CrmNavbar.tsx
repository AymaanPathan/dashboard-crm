import Link from "next/link";
import React from "react";

const CrmNavbar = () => {
  return (
    <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  CRM
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Navigation Links */}
          </div>
          <div className="flex items-center gap-4">
            {/* Logo */}
            <nav className="flex items-center gap-1">
              <Link
                href="/crm/dashboard"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors `}
              >
                CRM
              </Link>
              <Link
                href="/people"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors `}
              >
                People
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <nav className="flex items-center gap-1">
              <Link
                href="/crm/dashboard"
                className={`px-4 py-2 text-sm font-mkedium rounded-lg transition-colors `}
              >
                Account
              </Link>
              <Link
                href="/people"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors `}
              >
                Logout
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmNavbar;
