"use client";
import React, { useEffect } from "react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";
import { Statusdata } from "@/models/org.model";

const LeadsDashboard = () => {
  const dispatch: RootDispatch = useDispatch();
  const currentOrg = useSelector(
    (state: RootState) => state.org.currentOrganization
  );

  console.log("Current Organization:", currentOrg);

  useEffect(() => {
    const getOrganizationData = async () => {
      await dispatch(getOrganizationInfo());
    };

    getOrganizationData();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-6">
          {currentOrg?.statuses?.map((column: Statusdata) => (
            <div
              key={column.name}
              className="bg-white rounded-lg border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{column.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default LeadsDashboard;
