/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILead } from "@/models/lead.model";
import {
  Building2,
  ChevronRight,
  Mail,
  PanelRightClose,
  Phone,
  User,
} from "lucide-react";
import React from "react";

interface SidebarDetailProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentLead: ILead;
  quickActions: any[];
}

export const SidebarDetail: React.FC<SidebarDetailProps> = ({
  sidebarOpen,
  setSidebarOpen,
  currentLead,
  quickActions,
}) => {
  return (
    <div
      className={`${
        sidebarOpen ? "w-80" : "w-0"
      } transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 shadow-sm`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {currentLead.name || "Unnamed Lead"}
              </h2>
              <p className="text-xs text-gray-500">Lead Details</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Contact Information
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate">
                {currentLead.email || "Not provided"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">
                {currentLead.mobileNumber || "Not provided"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate">
                {currentLead.organizationId || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-500">Source</span>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                  {currentLead.source || "Unknown"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Type</span>
              <div className="mt-1">
                <span className="text-xs font-medium text-gray-900">
                  {currentLead.leadType || "Not specified"}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Position</span>
              <div className="mt-1">
                <span className="text-xs font-medium text-gray-900">
                  {currentLead.position || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {currentLead.requirements && (
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Requirements
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentLead.requirements.slice(0, 120)}
              {currentLead.requirements.length > 120 && "..."}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 mt-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((actionItem) => {
              const IconComponent = actionItem.icon;
              return (
                <button
                  key={actionItem.name}
                  onClick={actionItem.action}
                  className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-gray-400" />
                    <span>{actionItem.name}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
