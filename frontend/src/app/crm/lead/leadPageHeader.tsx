import { ILead, ILeadNotes } from "@/models/lead.model";
import { LeadTask } from "@/models/leadTask.model";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
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
    { id: "logs", label: "Activity", icon: Activity, count: null },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="mx-auto px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Go back"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Open sidebar"
              >
                <PanelRightOpen className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`group relative px-3 py-2 text-sm font-medium rounded-t-md transition-colors ${
                  activeTab === tab.id
                    ? "text-gray-900 bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-xs ${
                        activeTab === tab.id ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
