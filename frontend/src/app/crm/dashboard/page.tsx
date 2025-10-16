/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Search, Filter, ArrowUpDown, Grid3x3 } from "lucide-react";

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
import { DropdownMenuForArray } from "@/components/dropdown/DropdownForArray";
import { LeadFilters } from "@/models/lead.model";
import { DropdownMenuForArrayOfObjects } from "@/components/dropdown/DropdownForArrayOfObj";
import { IStage } from "@/models/stage.model";
import { IUser } from "@/models/user.model";
import { CustomButton } from "@/components/reuseable/Buttons/Button";
import ErrorToast from "@/assets/toast/ErrorToast";

const LeadsDashboard: React.FC = () => {
  const [isAddLeadOptionsOpen, setIsAddLeadOptionsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    LeadFilters["leadType"] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<IStage | null>(null);
  const [isAddLeadFormOpen, setIsAddLeadFormOpen] = useState(false);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const usersByRole = useSelector((state: RootState) => state.user.teamMembers);

  const leadTypes = ["All", "Hot", "Cold", "Warm"];
  const stages = useSelector((state: RootState) => state.stages.stages);

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
    const filters: LeadFilters = {
      leadType:
        selectedType && selectedType !== "All"
          ? (selectedType.toLowerCase() as LeadFilters["leadType"])
          : undefined,
      stageId:
        selectedStage && selectedStage.name !== "All"
          ? selectedStage.id
          : undefined,
      assignedToId: selectedUser?.id,
      search: undefined,
    };

    fetchKanbanData(filters);
    dispatch(getUserByRoleSlice());
    dispatch(fetchStages());
    dispatch(getTodayLeadTasksSlice());
  }, [dispatch, selectedStage, selectedType, selectedUser, searchTerm]);

  const handleSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || searchTerm.trim() === "") {
      const filters: LeadFilters = {
        leadType:
          selectedType && selectedType !== "All"
            ? (selectedType.toLowerCase() as LeadFilters["leadType"])
            : undefined,
        stageId:
          selectedStage && selectedStage.name !== "All"
            ? selectedStage.id
            : undefined,
        assignedToId: selectedUser?.id,
        search: searchTerm.trim() === "" ? undefined : searchTerm.trim(),
      };

      dispatch(fetchLeadForKanban({ filters }));
    }
  };

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
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-gray-900">Deals</h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    onKeyDown={handleSearchChange}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search something..."
                    className="w-64 h-9 pl-9 pr-4 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                <CustomButton
                  onClick={() => setIsAddLeadOptionsOpen(true)}
                  variant="primary"
                  icon={<Plus className="h-3.5 w-3.5" />}
                  className="h-9 text-xs"
                  style={{ background: "var(--color-text)" }}
                >
                  Add New
                </CustomButton>
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
          <div className="px-6 py-4">
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
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default LeadsDashboard;
