/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Search } from "lucide-react";

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
  console.log("Selected User:", selectedUser);
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
  }, [dispatch]);

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

    const getOrganizationData = async (): Promise<void> => {
      await dispatch(getOrganizationInfo());
    };

    dispatch(fetchLeadForKanban(filters));
    dispatch(getUserByRoleSlice());
    dispatch(fetchStages());
    dispatch(getTodayLeadTasksSlice());
    getOrganizationData();
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

      dispatch(fetchLeadForKanban(filters));
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
        <div className="min-h-screen bg-white">
          <div className="px-12 py-8">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  onKeyDown={handleSearchChange}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search leads..."
                  className="w-full h-9 pl-9 pr-3 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <DropdownMenuForArray
                  selectedType={selectedType ? selectedType : "All"}
                  setSelectedType={setSelectedType}
                  items={leadTypes}
                  dropdownLabel="Lead Type"
                />

                <DropdownMenuForArrayOfObjects
                  selectedType={selectedStage ? selectedStage : "All"}
                  setSelectedType={setSelectedStage}
                  items={stages.map((stage) => stage)}
                  dropdownLabel="Stage"
                />

                {usersByRole.salesReps.length > 0 && (
                  <DropdownMenuForArrayOfObjects
                    selectedType={selectedUser ? selectedUser.username : "All"}
                    setSelectedType={setSelectedUser}
                    items={usersByRole.salesReps.map((user) => user)}
                    dropdownLabel="User"
                  />
                )}
              </div>

              {/* Add Lead Button */}
              <button
                onClick={() => setIsAddLeadOptionsOpen(true)}
                className="ml-auto h-9 px-4 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Lead
              </button>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {kanbanData?.map((stage: any, index: number) => (
                <StatusColumn key={index} stage={stage} />
              ))}
            </div>
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default LeadsDashboard;
