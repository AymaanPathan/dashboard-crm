"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BarChart3, Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { getToken } from "@/utils/auth.utils";
import { logoutUser } from "@/store/slices/authSlice";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const currentOrganization = useSelector(
    (state: RootState) => state.org.currentOrganization
  );
  console.log("Current Organization in Navbar:", currentOrganization);
  const token = getToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch: RootDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="border-b border-gray-200/60 bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              CRMFlow
            </span>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Testimonials
            </a>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {!token ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {currentOrganization ? (
                  <Link
                    href="/crm/dashboard"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    Go To Organization
                  </Link>
                ) : (
                  <Link
                    href="/organizationsetup"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    Setup Organization
                  </Link>
                )}
                <Link
                  onClick={handleLogout}
                  href="/"
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Logout
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && <MobileMenu />}
    </nav>
  );
}
