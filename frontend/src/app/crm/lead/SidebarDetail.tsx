/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILead } from "@/models/lead.model";
import { Building2, Mail, PanelRightClose, Phone, User } from "lucide-react";
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
        sidebarOpen ? "w-64" : "w-0"
      } transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-gray-500" />
            </div>
            <span className="font-medium text-sm text-gray-900 truncate">
              {currentLead.name || "Unnamed Lead"}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all flex-shrink-0"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-3">Contact</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate text-xs">
                {currentLead.email || "No email"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 text-xs">
                {currentLead.mobileNumber || "No phone"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate text-xs">
                {currentLead.organizationId || "No organization"}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-3">Details</div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Source</div>
              <div className="text-xs text-gray-900">
                {currentLead.source || "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Type</div>
              <div className="text-xs text-gray-900">
                {currentLead.leadType || "Not specified"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Position</div>
              <div className="text-xs text-gray-900">
                {currentLead.position || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {currentLead.requirements && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Requirements
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {currentLead.requirements.slice(0, 120)}
              {currentLead.requirements.length > 120 && "..."}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-4 py-4">
          <div className="text-xs font-medium text-gray-500 mb-2">Actions</div>
          <div className="space-y-0.5">
            {quickActions.map((actionItem) => {
              const IconComponent = actionItem.icon;
              return (
                <button
                  key={actionItem.name}
                  onClick={actionItem.action}
                  className="w-full px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-all text-left flex items-center gap-2"
                >
                  <IconComponent className="h-3.5 w-3.5 text-gray-400" />
                  <span>{actionItem.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
