/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Search, Grid3x3, List } from "lucide-react";

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
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-100 border-t-gray-900"></div>
            <div className="absolute inset-0 h-10 w-10 animate-pulse rounded-full border-[3px] border-transparent border-t-gray-300 opacity-30"></div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-900 tracking-tight">
              Loading workspace
            </span>
            <span className="text-[11px] text-gray-500 animate-pulse">
              Please wait a moment...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30">
          {/* Top Bar - Optimized Size */}
          <div className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
            <div className="mx-auto max-w-[1600px] px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-[13px] font-semibold tracking-[-0.02em] text-gray-900 flex items-center gap-2">
                    Deals
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100/80 px-1.5 py-0.5 rounded-md">
                      Pipeline
                    </span>
                  </h1>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                  {/* Search - Optimized Size */}
                  <div className="group relative">
                    <Search className="absolute left-2.5 top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-gray-400 transition-all duration-200 group-hover:text-gray-600 group-focus-within:text-gray-700" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type="text"
                      placeholder="Search deals..."
                      className="h-[30px] w-[240px] rounded-lg border border-gray-200/80 bg-white/60 pl-8 pr-3 text-[12px] font-normal text-gray-900 placeholder-gray-400 shadow-sm shadow-gray-900/[0.04] transition-all duration-200 hover:border-gray-300/80 hover:bg-white hover:shadow-md hover:shadow-gray-900/[0.06] focus:border-gray-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-200/40 focus:shadow-md focus:shadow-gray-900/[0.06]"
                    />
                  </div>

                  {/* View Toggles - Optimized Size */}
                  <div className="inline-flex items-center gap-0.5 rounded-lg border border-gray-200/70 bg-white/80 p-[2px] shadow-sm shadow-gray-900/[0.04]">
                    <button
                      onClick={() => setIsListView(false)}
                      className={`group cursor-pointer relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-[4px] text-[11.5px] font-medium transition-all duration-200 ${
                        !isListView
                          ? "bg-black text-white shadow-sm shadow-gray-900/[0.08]"
                          : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                      }`}
                    >
                      <Grid3x3
                        className={`h-[13px] w-[13px] transition-all duration-200 ${
                          !isListView
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span className="tracking-[-0.01em]">Board</span>
                    </button>
                    <button
                      onClick={() => setIsListView(true)}
                      className={`group cursor-pointer relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-[4px] text-[11.5px] font-medium transition-all duration-200 ${
                        isListView
                          ? "bg-black text-white shadow-sm shadow-gray-900/[0.08]"
                          : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                      }`}
                    >
                      <List
                        className={`h-[13px] w-[13px] transition-all duration-200 ${
                          isListView
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span className="tracking-[-0.01em]">List</span>
                    </button>
                  </div>

                  {/* Add Button - Optimized Size */}
                  <button
                    onClick={() => setIsAddLeadOptionsOpen(true)}
                    className="group relative inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-gray-900 to-gray-800 px-3 py-[6px] text-[11.5px] font-semibold text-white shadow-sm shadow-gray-900/20 transition-all duration-200 hover:shadow-md hover:shadow-gray-900/30 hover:translate-y-[-1px] active:scale-[0.98] active:shadow-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <Plus className="relative h-[13px] w-[13px] transition-transform duration-300 group-hover:rotate-90" />
                    <span className="relative tracking-[-0.01em]">
                      New deal
                    </span>
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

          {/* Main Content Area - Optimized Size */}
          <div className="mx-auto max-w-[1600px] pt-5">
            {isListView ? (
              <div className="animate-in fade-in-0 duration-300 slide-in-from-bottom-2">
                <KanbanListView />
              </div>
            ) : (
              <div className="flex gap-3.5 overflow-x-auto pb-6 px-5 animate-in fade-in-0 duration-300 slide-in-from-bottom-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {kanbanData?.map((stage: any, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 animate-in fade-in-0 slide-in-from-bottom-3"
                    style={{
                      animationDelay: `${index * 60}ms`,
                      animationDuration: "400ms",
                    }}
                  >
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
