"use client";
import React, { useState } from "react";
import { BarChart3, Menu, X } from "lucide-react";
import { getToken } from "@/utils/auth.utils";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function Navbar() {
  const currentOrganization = useSelector(
    (state: RootState) => state.org.currentOrganization
  );
  const token = getToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-black/8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[60px]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-black">
              CRMFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <a
              href="#features"
              className="text-black/70 hover:text-black hover:bg-black/5 px-3 py-1.5 rounded-md text-[14px] font-normal transition-all"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-black/70 hover:text-black hover:bg-black/5 px-3 py-1.5 rounded-md text-[14px] font-normal transition-all"
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {!token ? (
              <>
                <button className="text-black/70 hover:text-black hover:bg-black/5 px-3 py-1.5 rounded-md text-[14px] font-normal transition-all">
                  Login
                </button>
                <button className="bg-black hover:bg-black/90 text-white px-3 py-1.5 rounded-md text-[14px] font-medium transition-all">
                  Get Started
                </button>
              </>
            ) : (
              <>
                <button className="text-black/70 hover:text-black hover:bg-black/5 px-3 py-1.5 rounded-md text-[14px] font-normal transition-all border border-black/10">
                  {currentOrganization?.id
                    ? "Go To Organization"
                    : "Setup Organization"}
                </button>
                <button className="bg-black hover:bg-black/90 text-white px-3 py-1.5 rounded-md text-[14px] font-medium transition-all">
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-1.5 rounded-md hover:bg-black/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-black/70" />
            ) : (
              <Menu className="w-5 h-5 text-black/70" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
