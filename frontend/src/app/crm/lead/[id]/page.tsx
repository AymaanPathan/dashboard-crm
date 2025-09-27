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
  Activity,
  FileText,
  Send,
  Edit3,
  Trash2,
  Receipt,
  ExternalLink,
  Download,
  DollarSign,
  Eye,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import {
  addLeadNote,
  getLeadNotes,
  getOneLeadbyId,
} from "@/store/slices/leadSlice";
import AddTask from "@/components/Task/AddTask";
import LeadLogs from "@/components/lead/LeadLogs";
import { getLeadTasksByLeadIdSlice } from "@/store/slices/leadTaskSlice";
import { CreateQuotationModal } from "@/components/quotation/CreateQuotationModal";
import { getQuotationsByLead } from "@/store/slices/quotationSlice";

const LeadDetailsPage = () => {
  const dispatch: RootDispatch = useDispatch();
  const { id } = useParams();
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const tasks = useSelector((state: RootState) => state.leadTasks.leadTasks);
  const leadNotes = useSelector((state: RootState) => state.lead.leadNotes);
  const quotations = useSelector(
    (state: RootState) => state.quotation.quotations
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const openQuotationModal = () => {
    setIsQuotationModalOpen(true);
  };
  const closeQuotationModal = () => {
    setIsQuotationModalOpen(false);
  };

  const currentLead = useSelector((state: RootState) => state.lead.lead);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getLeadTasksByLeadIdSlice(currentLead.id ?? ""));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getQuotationsByLead(currentLead.id!));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getLeadNotes(currentLead.id!));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getOneLeadbyId(id));
    }
  }, [id, dispatch]);

  const handleAddNote = async () => {
    await dispatch(
      addLeadNote({ leadId: currentLead.id || "", note: newNote })
    );
    setNewNote("");
    setIsAddingNote(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openQuotationInNewTab = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

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

  const getQuotationStatusBadge = (isOrder: boolean) => {
    return isOrder
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "logs") {
      setShowLogs(true);
      setShowAddTask(false);
    } else {
      setShowLogs(false);
      if (tab !== "tasks") {
        setShowAddTask(false);
      }
    }
  };

  const getTabTitle = () => {
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

  const getTabSubtitle = () => {
    switch (activeTab) {
      case "tasks":
        return `${tasks?.length || 0} tasks for ${
          currentLead.name || "this lead"
        }`;
      case "logs":
        return `Activity history for ${currentLead.name || "this lead"}`;
      case "notes":
        return `${leadNotes.length} notes for ${
          currentLead.name || "this lead"
        }`;
      case "quotations":
        return `${quotations?.length || 0} quotations for ${
          currentLead.name || "this lead"
        }`;
      default:
        return "";
    }
  };

  const quickActions = [
    {
      name: "Send Email",
      action: () => console.log("Send email"),
      icon: Mail,
    },
    {
      name: "Schedule Call",
      action: () => console.log("Schedule call"),
      icon: Phone,
    },
    {
      name: "Create Quotation",
      action: openQuotationModal,
      icon: Receipt,
    },
    {
      name: "Add Note",
      action: () => {
        setActiveTab("notes");
        setIsAddingNote(true);
      },
      icon: FileText,
    },
  ];

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="h-16 px-6 flex items-center justify-between">
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
                <h1 className="text-lg font-semibold text-gray-900">
                  {getTabTitle()}
                </h1>
                <p className="text-sm text-gray-500">{getTabSubtitle()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Create Quotation Button - Always Visible */}
              <button
                onClick={openQuotationModal}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Create Quotation
              </button>

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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotations..."
                    className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6">
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => handleTabChange("tasks")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "tasks"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Tasks
                  <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tasks?.length || 0}
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("quotations")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "quotations"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Quotations
                  <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {quotations?.length || 0}
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("notes")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "notes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                  <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {leadNotes.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("logs")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "logs"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity Log
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "tasks" ? (
              <div className="p-6">
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
            ) : activeTab === "quotations" ? (
              <div className="p-6">
                {quotations?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Receipt className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No quotations yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Create your first quotation for this lead
                    </p>
                    <button
                      onClick={openQuotationModal}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Create First Quotation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quotations.map((quotation) => (
                      <div
                        key={quotation.id}
                        className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {quotation.quotationName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {quotation.quoteNumber} •{" "}
                                  {quotation.customerName}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {quotation.pdfUrl && (
                                  <button
                                    onClick={() =>
                                      openQuotationInNewTab(quotation.pdfUrl)
                                    }
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Open PDF"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </button>
                                )}
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getQuotationStatusBadge(
                                  quotation.isOrder!
                                )}`}
                              >
                                {quotation.isOrder ? "Order" : "Quote"}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                <Calendar className="h-3 w-3" />
                                Valid until{" "}
                                {quotation.validUntil
                                  ? new Date(
                                      quotation.validUntil
                                    ).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-sm">
                                  <span className="text-gray-500">
                                    Subtotal:{" "}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(quotation.subtotal!)}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Tax: </span>
                                  <span className="font-medium text-gray-900">
                                    {quotation.tax!}%
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Total: </span>
                                  <span className="font-semibold text-gray-900 text-lg">
                                    {formatCurrency(quotation.total)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {quotation.items?.length || 0} items
                                </span>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(quotation.createdAt!)}
                                </span>
                              </div>
                            </div>

                            {/* Items Preview (first 2 items) */}
                            {quotation.items && quotation.items.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="space-y-1">
                                  {quotation.items
                                    .slice(0, 2)
                                    .map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between text-sm"
                                      >
                                        <span className="text-gray-600 truncate">
                                          {item.description}
                                        </span>
                                        <span className="text-gray-500 ml-2 flex-shrink-0">
                                          {item.quantity} ×{" "}
                                          {formatCurrency(item.price)}
                                        </span>
                                      </div>
                                    ))}
                                  {quotation.items.length > 2 && (
                                    <div className="text-xs text-gray-500 italic">
                                      +{quotation.items.length - 2} more items
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "notes" ? (
              <div className="p-6">
                {/* Add Note Input */}
                {isAddingNote && (
                  <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add your note here..."
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={4}
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            Adding note as Current User
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsAddingNote(false);
                                setNewNote("");
                              }}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddNote}
                              disabled={!newNote.trim()}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Send className="h-3 w-3" />
                              Save Note
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes List */}
                {leadNotes.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No notes yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start documenting your interactions with this lead
                    </p>
                    <button
                      onClick={() => setIsAddingNote(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add First Note
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leadNotes.map((note) => (
                      <div
                        key={note.id}
                        className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {note.userName}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatDate(
                                    note?.createdAt?.toLocaleString() || ""
                                  )}
                                  {note.updatedAt !== note.createdAt &&
                                    " • edited"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {note.note}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <LeadLogs leadId={currentLead?.id} />
            )}
          </div>

          {/* Right Sidebar for Add Task */}
          {showAddTask && activeTab === "tasks" && (
            <div className="w-96 border-l border-gray-200 bg-white">
              <div className="h-full overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between"></div>
                <AddTask leadId={currentLead?.id} />
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateQuotationModal
        isOpen={isQuotationModalOpen}
        onClose={closeQuotationModal}
        leadData={currentLead}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
    </div>
  );
};

export default LeadDetailsPage;
