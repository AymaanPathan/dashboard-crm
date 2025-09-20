/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Search, Filter, UserPlus, Upload, FileText } from "lucide-react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";
import { fetchLeadForKanban } from "@/store/slices/kanbanSlice";
import { StatusColumn } from "@/components/lead/StatusCol";
import { AddLeadForm } from "@/components/Form/AddLeadForm";

// Shadcn UI Components (assuming they're available)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getUserByRoleSlice } from "@/store/slices/userSlice";
import { fetchStages } from "@/store/slices/stagesSlice";
import { AddLeadOptionsModal } from "@/components/lead/AddLeadOptionsModal";
import { ExcelUploadModal } from "@/components/lead/ExcelUploadModal";
import { getTodayLeadTasksSlice } from "@/store/slices/leadTaskSlice";
import { DropdownMenuShortcut } from "@/components/dropdown/Dropdown";

const LeadsDashboard: React.FC = () => {
  const [isAddLeadOptionsOpen, setIsAddLeadOptionsOpen] = useState(false);
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
    const getOrganizationData = async (): Promise<void> => {
      await dispatch(getOrganizationInfo());
    };
    dispatch(fetchLeadForKanban());
    dispatch(getUserByRoleSlice());
    dispatch(fetchStages());
    dispatch(getTodayLeadTasksSlice());

    getOrganizationData();
  }, [dispatch]);

  if (!currentOrg) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground"></div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  className="pl-8 h-9 w-[250px] lg:w-[300px]"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex items-center justify-between space-y-2">
                <Button
                  onClick={() => setIsAddLeadOptionsOpen(true)}
                  className="h-8"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </div>
              <div className="flex items-center justify-between space-y-2">
               <DropdownMenuShortcut/>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {kanbanData?.map((stage: any, index: number) => (
              <StatusColumn key={index} stage={stage} />
            ))}
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default LeadsDashboard;
