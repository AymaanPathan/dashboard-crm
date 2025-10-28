/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Search,  Grid3x3, List } from "lucide-react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";
import { fetchLeadForKanban } from "@/store/slices/kanbanSlice";
import { StatusColumn } from "@/components/lead/StatusCol";
import { AddLeadForm } from "@/components/lead/AddLeadForm";

import { getUserByRoleSlice } from "@/store/slices/userSlice";
import { fetchStages } from "@/store/slices/stagesSlice";
import { AddLeadOptionsModal } from "@/components/lead/AddLeadOptionsModal";
import { ExcelUploadModal } from "@/components/lead/ExcelUploadModal";
import { getTodayLeadTasksSlice } from "@/store/slices/leadTaskSlice";
import { LeadFilters } from "@/models/lead.model";
import ErrorToast from "@/assets/toast/ErrorToast";
import { KanbanListView } from "@/components/lead/LeadListView";

const LeadsDashboard: React.FC = () => {
  const [isListView, setIsListView] = useState(false);
  const [isAddLeadOptionsOpen, setIsAddLeadOptionsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLeadFormOpen, setIsAddLeadFormOpen] = useState(false);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);

  const handleSelectForm = () => {
    setIsAddLeadOptionsOpen(false);
    setIsAddLeadFormOpen(true);
  };

  const handleSelectExcel = () => {
    setIsAddLeadOptionsOpen(false);
    setIsExcelUploadOpen(true);
  };
  const dispatch = useDispatch<RootDispatch>();
  const kanbanData = useSelector((state: RootState) => state.kanban.kanbanData);

  const currentOrg = useSelector(
    (state: RootState) => state.org.currentOrganization
  );

  useEffect(() => {
    dispatch(getUserByRoleSlice());
    dispatch(getOrganizationInfo());
  }, [dispatch]);

  const fetchKanbanData = async (filters: LeadFilters) => {
    try {
      await dispatch(fetchLeadForKanban({ filters })).unwrap();
    } catch (error) {
      ErrorToast({
        title: "Error",
        description: error as string,
      });
    }
  };

  useEffect(() => {
    fetchKanbanData({});
    dispatch(getUserByRoleSlice());
    dispatch(fetchStages());
    dispatch(getTodayLeadTasksSlice());
  }, [dispatch, searchTerm]);

  if (!currentOrg) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"></div>
          <span className="text-sm text-gray-600">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen">
          {/* Top Bar */}
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-[15px] font-semibold text-gray-900">
                  Deals
                </h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search deals..."
                    className="w-64 h-8 pl-9 pr-3 text-[13px] bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={() => setIsAddLeadOptionsOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New deal</span>
                </button>

                {/* View Toggles */}
                <div className="flex items-center gap-1 bg-gray-100/60 backdrop-blur-sm p-0.5 rounded-lg border border-gray-200/40">
                  <button
                    onClick={() => setIsListView(true)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-md transition-all ${
                      isListView
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setIsListView(false)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-md transition-all ${
                      !isListView
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Grid3x3 className="w-3.5 h-3.5" />
                    <span>Board</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AddLeadOptionsModal
            isOpen={isAddLeadOptionsOpen}
            onClose={() => setIsAddLeadOptionsOpen(false)}
            onSelectForm={handleSelectForm}
            onSelectExcel={handleSelectExcel}
          />

          {isAddLeadFormOpen && (
            <AddLeadForm
              isOpen={isAddLeadFormOpen}
              onClose={() => setIsAddLeadFormOpen(false)}
            />
          )}

          <ExcelUploadModal
            isOpen={isExcelUploadOpen}
            onClose={() => setIsExcelUploadOpen(false)}
          />

          {/* Kanban Board */}
          {/* Kanban Board or List View */}
          <div className="px-6 py-4">
            {isListView ? (
              <>
                {/* Replace this with your actual list view component */}
                <KanbanListView />
              </>
            ) : (
              <div
                className="flex gap-4 overflow-x-auto pb-4"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d1d5db transparent",
                }}
              >
                {kanbanData?.map((stage: any, index: number) => (
                  <div key={index} className="flex-shrink-0">
                    <StatusColumn stage={stage} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default LeadsDashboard;
