"use client";
import React from "react";

export const MobileMenu: React.FC = () => {
  return (
    <div className="md:hidden border-t border-gray-200 bg-white">
      <div className="px-4 py-2 space-y-2">
        <a
          href="#features"
          className="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Pricing
        </a>

        <button className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
          Login
        </button>
        <button className="block w-full text-left px-3 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 mt-2">
          Get Started
        </button>
      </div>
    </div>
  );
};
