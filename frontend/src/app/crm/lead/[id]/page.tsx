"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  UserCheck,
  Globe,
  FileText,
  Tag,
  Briefcase,
  ChevronRight,
  Hash,
  ChevronLeft,
  PanelRightOpen,
  PanelRightClose,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import { getOneLeadbyId } from "@/store/slices/leadSlice";
import AddTask from "@/components/Task/AddTask";

const LeadDetailsPage = () => {
  const dispatch: RootDispatch = useDispatch();
  const { id } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  console.log("Lead ID from params:", id);
  const currentLead = useSelector((state: RootState) => state.lead.lead);
  const { loading } = useSelector((state: RootState) => state.lead);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getOneLeadbyId(id));
    }
  }, [id, dispatch]);

  // Handle task creation
  const handleTaskCreated = (newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    console.log("New task added:", newTask);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <p className="text-sm text-neutral-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  // Format address for display
  const formatAddress = () => {
    const { address } = currentLead;
    if (!address) return "Not provided";

    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return task.status === "pending";
    if (activeTab === "completed") return task.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50/30">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 overflow-hidden border-r border-neutral-200 bg-white`}
        >
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-neutral-900">
                    Lead Details
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {currentLead.name || "Unnamed Lead"}
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  <PanelRightClose className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Lead Info */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Contact
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-700">
                        {currentLead.email || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-700">
                        {currentLead.mobileNumber || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-700">
                        {currentLead.organizationId || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Details
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Source</span>
                      <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
                        {currentLead.source || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Type</span>
                      <span className="text-xs font-medium text-neutral-700">
                        {currentLead.leadType || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Position</span>
                      <span className="text-xs font-medium text-neutral-700">
                        {currentLead.position || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {currentLead.requirements && (
                  <div className="border-t border-neutral-100 pt-4">
                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                      Requirements
                    </div>
                    <div className="text-sm text-neutral-600 leading-relaxed">
                      {currentLead.requirements.slice(0, 150)}
                      {currentLead.requirements.length > 150 && "..."}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  Actions
                </div>
                <div className="space-y-1">
                  <button className="w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors text-left flex items-center justify-between group">
                    <span>Send Email</span>
                    <ChevronRight className="h-3 w-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors text-left flex items-center justify-between group">
                    <span>Schedule Call</span>
                    <ChevronRight className="h-3 w-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors text-left flex items-center justify-between group">
                    <span>Add Note</span>
                    <ChevronRight className="h-3 w-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  <PanelRightOpen className="h-4 w-4" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-neutral-900">
                  Tasks for {currentLead.name || "Lead"}
                </h1>
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  {tasks.length} total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-9 pr-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent w-64"
                />
              </div>
              <button className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex">
            {/* Task List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-neutral-200 mb-6">
                  {[
                    { id: "all", label: "All Tasks", count: tasks.length },
                    {
                      id: "pending",
                      label: "Pending",
                      count: tasks.filter((t) => t.status === "pending").length,
                    },
                    {
                      id: "completed",
                      label: "Completed",
                      count: tasks.filter((t) => t.status === "completed")
                        .length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-neutral-900 text-neutral-900"
                          : "border-transparent text-neutral-500 hover:text-neutral-700"
                      }`}
                    >
                      {tab.label}{" "}
                      {tab.count > 0 && (
                        <span className="ml-1 text-xs bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="h-12 w-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-6 w-6 text-neutral-400" />
                      </div>
                      <h3 className="text-sm font-medium text-neutral-900 mb-1">
                        No tasks yet
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Create your first task to get started
                      </p>
                    </div>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <div
                        key={task.id || index}
                        className="group p-4 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">
                              {getTaskStatusIcon(task.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-neutral-900">
                                  {task.title}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded border font-medium ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
                                <span className="capitalize">{task.type}</span>
                                {task.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                    {task.dueTime && ` at ${task.dueTime}`}
                                  </span>
                                )}
                                {task.assignedTo && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assignedTo}
                                  </span>
                                )}
                              </div>

                              {task.description && (
                                <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              {task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {task.tags
                                    .slice(0, 3)
                                    .map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  {task.tags.length > 3 && (
                                    <span className="text-xs text-neutral-500 px-2 py-0.5">
                                      +{task.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <button className="p-1 text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Add Task Panel */}
            <div className="w-96 border-l border-neutral-200 bg-white">
              <div className="h-full overflow-y-auto">
                <AddTask
                  leadId={currentLead.id}
                  onTaskCreated={handleTaskCreated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
