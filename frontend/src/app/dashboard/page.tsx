"use client";
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";
import { StatusColumn } from "../components/lead/StatusCol";
import { fetchLeadForKanban } from "@/store/slices/kanbanSlice";

const LeadsDashboard: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const statuses = useSelector((state: RootState) => state.kanban.statuses);
  console.log("statuses", statuses);

  const currentOrg = useSelector(
    (state: RootState) => state.org.currentOrganization
  );

  console.log("statuses", statuses);

  useEffect(() => {
    const getOrganizationData = async (): Promise<void> => {
      await dispatch(getOrganizationInfo());
    };
    dispatch(fetchLeadForKanban());

    getOrganizationData();
  }, [dispatch]);

  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading organization data...</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Leads Dashboard
            </h1>
            <p className="text-gray-600">
              Drag and drop leads between statuses
            </p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {statuses?.map((status: any, index: number) => (
              <StatusColumn key={index} status={status} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default LeadsDashboard;
