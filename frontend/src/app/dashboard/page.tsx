/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";
import { fetchLeadForKanban } from "@/store/slices/kanbanSlice";
import { StatusColumn } from "@/components/pages/lead/StatusCol";
import { AddLeadForm } from "@/components/Form/AddLeadForm";

// Shadcn UI Components (assuming they're available)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Sales Pipeline
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage leads through your sales process
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search leads..."
                    className="pl-10 w-64 h-9 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>

                {/* Filter */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-gray-200 hover:border-black"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                {/* More */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 border-gray-200 hover:border-black"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem>Import</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Add Lead */}
                <Button
                  onClick={() => setIsAddLeadOpen(true)}
                  size="sm"
                  className="h-9 bg-black text-white hover:bg-gray-900"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-5 gap-4">
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
