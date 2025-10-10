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
    <div className="bg-white">
      <div className="px-8 pb-2">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
              >
                <PanelRightOpen className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-3 cursor-pointer px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className="text-gray-400 text-xs font-normal">
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
