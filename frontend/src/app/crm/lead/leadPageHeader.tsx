import { ILead, ILeadNotes } from "@/models/lead.model";
import { LeadTask } from "@/models/leadTask.model";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import {
  Activity,
  CheckCircle2,
  FileText,
  PanelRightOpen,
  Plus,
  Receipt,
  Search,
} from "lucide-react";
import React from "react";

const getTabTitle = (activeTab: string) => {
  switch (activeTab) {
    case "tasks":
      return "Tasks";
    case "logs":
      return "Activity Log";
    case "notes":
      return "Notes";
    case "quotations":
      return "Quotations";
    default:
      return "Tasks";
  }
};

const getTabSubtitle = (
  activeTab: string,
  currentLead: ILead,
  tasks: LeadTask[],
  leadNotes: ILeadNotes[],
  quotations: ICreateQuotationPayload[]
) => {
  switch (activeTab) {
    case "tasks":
      return `${tasks?.length || 0} tasks for ${
        currentLead.name || "this lead"
      }`;
    case "logs":
      return `Activity history for ${currentLead.name || "this lead"}`;
    case "notes":
      return `${leadNotes.length} notes for ${currentLead.name || "this lead"}`;
    case "quotations":
      return `${quotations?.length || 0} quotations for ${
        currentLead.name || "this lead"
      }`;
    default:
      return "";
  }
};

interface LeadPageHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  tasks: LeadTask[];
  quotations: ICreateQuotationPayload[];
  leadNotes: ILeadNotes[];
  setShowAddTask: (show: boolean) => void;
  showAddTask: boolean;
  setIsAddingNote: (adding: boolean) => void;
  openQuotationModal: () => void;
  currentLead: ILead;
}

export const LeadPageHeader: React.FC<LeadPageHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  handleTabChange,
  tasks,
  quotations,
  leadNotes,
  currentLead,
  openQuotationModal,
  setShowAddTask,
  showAddTask,
  setIsAddingNote,
}) => {
  const tabs = [
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckCircle2,
      count: tasks?.length || 0,
    },
    {
      id: "quotations",
      label: "Quotations",
      icon: Receipt,
      count: quotations?.length || 0,
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      count: leadNotes.length || 0,
    },
    { id: "logs", label: "Activity Log", icon: Activity, count: null },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <PanelRightOpen className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {getTabTitle(activeTab)}
            </h1>
            <p className="text-sm text-gray-500">
              {getTabSubtitle(
                activeTab,
                currentLead,
                tasks,
                leadNotes,
                quotations
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "tasks" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </>
          )}
          {activeTab === "notes" && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </button>
          )}
          {activeTab === "quotations" && (
            <>
              <button
                onClick={openQuotationModal}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Create Quotation
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quotations..."
                  className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-6">
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 cursor-pointer px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
