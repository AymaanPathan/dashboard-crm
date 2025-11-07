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
      <div className="flex h-screen items-center justify-center bg-[#ffffff]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-gray-800"></div>
            <div className="absolute inset-0 h-10 w-10 animate-pulse rounded-full border-[3px] border-transparent border-t-gray-400 opacity-40"></div>
          </div>
          <span className="text-sm font-medium text-gray-600 animate-pulse">
            Loading workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-[#ffffff]">
          {/* Top Bar - Notion Style */}
          <div className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
            <div className="mx-auto max-w-[1600px] px-8 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <h1 className="text-base font-semibold tracking-tight text-gray-900">
                    Deals
                  </h1>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                  {/* Search - Notion Style */}
                  <div className="group relative">
                    <Search className="absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-500" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type="text"
                      placeholder="Search deals..."
                      className="h-9 w-72 rounded-md border border-gray-200/80 bg-gray-50/50 pl-10 pr-4 text-[13.5px] font-normal text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-white focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200/50"
                    />
                  </div>

                  {/* View Toggles - Notion Style */}
                  <div className="inline-flex items-center gap-0.5 rounded-lg border border-gray-200/80 bg-gray-50/50 p-0.5 shadow-sm">
                    <button
                      onClick={() => setIsListView(true)}
                      className={`group inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                        isListView
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                      }`}
                    >
                      <List
                        className={`h-[15px] w-[15px] transition-all ${
                          isListView
                            ? "text-gray-900"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span>List</span>
                    </button>
                    <button
                      onClick={() => setIsListView(false)}
                      className={`group inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                        !isListView
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                      }`}
                    >
                      <Grid3x3
                        className={`h-[15px] w-[15px] transition-all ${
                          !isListView
                            ? "text-gray-900"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span>Board</span>
                    </button>
                  </div>

                  {/* Add Button - Notion Style */}
                  <button
                    onClick={() => setIsAddLeadOptionsOpen(true)}
                    className="group inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow active:scale-[0.98]"
                  >
                    <Plus className="h-[15px] w-[15px] transition-transform group-hover:rotate-90 duration-300" />
                    <span>New deal</span>
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

          {/* Main Content Area - Notion Style */}
          <div className="mx-auto max-w-[1600px] px-8 py-6">
            {isListView ? (
              <div className="animate-in fade-in duration-300">
                <KanbanListView />
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-6 animate-in fade-in duration-300">
                {kanbanData?.map((stage: any, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 animate-in fade-in-50 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
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
