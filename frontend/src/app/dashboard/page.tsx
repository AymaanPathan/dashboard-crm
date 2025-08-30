/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";
import { fetchLeadForKanban } from "@/store/slices/kanbanSlice";
import { StatusColumn } from "@/components/lead/StatusCol";
import { AddLeadForm } from "@/components/Form/AddLeadForm";

import CrmNavbar from "@/components/CrmNavbar";

const LeadsDashboard: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const kanbanData = useSelector((state: RootState) => state.kanban.kanbanData);
  console.log("kanbanData:", kanbanData);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  const currentOrg = useSelector(
    (state: RootState) => state.org.currentOrganization
  );

  useEffect(() => {
    const getOrganizationData = async (): Promise<void> => {
      await dispatch(getOrganizationInfo());
    };
    dispatch(fetchLeadForKanban());

    getOrganizationData();
  }, [dispatch]);

  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50/50">
        {/* Kanban Board */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-5 gap-6">
            {kanbanData?.map((stage: any, index: number) => {
              return <StatusColumn key={index} stage={stage} />;
            })}
          </div>
        </div>

        <AddLeadForm
          isOpen={isAddLeadOpen}
          onClose={() => setIsAddLeadOpen(false)}
        />
      </div>
    </DndProvider>
  );
};

export default LeadsDashboard;
