"use client";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/store";

const LeadDetailsPage = () => {
  const currentLead = useSelector((state: RootState) => state.lead.lead);
  console.log("Current Lead:", currentLead); // Debugging line
  const { loading } = useSelector((state: RootState) => state.lead);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-56"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold">{currentLead.name}</h1>
      <p>Email: {currentLead.email}</p>

      {/* Add more details as needed */}
    </div>
  );
};

export default LeadDetailsPage;
