"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Phone,
  Building2,
  ChevronRight,
  PanelRightOpen,
  PanelRightClose,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  User,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import { getOneLeadbyId } from "@/store/slices/leadSlice";
import AddTask from "@/components/Task/AddTask";
import { getLeadTasksByLeadIdSlice } from "@/store/slices/leadTaskSlice";

const LeadDetailsPage = () => {
  const dispatch: RootDispatch = useDispatch();
  const { id } = useParams();
  const tasks = useSelector((state: RootState) => state.leadTasks.leadTasks);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const currentLead = useSelector((state: RootState) => state.lead.lead);
  const { loading } = useSelector((state: RootState) => state.lead);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getLeadTasksByLeadIdSlice(currentLead.id ?? ""));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getOneLeadbyId(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-700 border-green-200",
      "in-progress": "bg-orange-100 text-orange-700 border-orange-200",
      pending: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
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
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
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
              {["Send Email", "Schedule Call", "Add Note"].map((action) => (
                <button
                  key={action}
                  className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-left flex items-center justify-between group"
                >
                  <span>{action}</span>
                  <ChevronRight className="h-3 w-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PanelRightOpen className="h-4 w-4" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-500">
                {tasks?.length || 0} tasks for {currentLead.name || "this lead"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto p-6">
            {tasks?.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first task to get started with this lead
                </p>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create First Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div
                    key={task?.id || index}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTaskStatusIcon(task?.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 pr-4">
                            {task.title}
                          </h4>
                          <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadge(
                              task?.status
                            )}`}
                          >
                            {task?.status}
                          </span>
                          {task.dueDate && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Task Sidebar */}
          {showAddTask && (
            <div className="w-96 border-l border-gray-200 bg-white">
              <div className="h-full overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between"></div>
                <AddTask leadId={currentLead?.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
