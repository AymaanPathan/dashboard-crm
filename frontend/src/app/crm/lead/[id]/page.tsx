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
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import { getOneLeadbyId } from "@/store/slices/leadSlice";
import AddTask from "@/components/Task/AddTask";

const LeadDetailsPage = () => {
  const dispatch: RootDispatch = useDispatch();
  const { id } = useParams();
  const [tasks, setTasks] = useState<any[]>([]); // State to manage tasks
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
    // Here you would typically also dispatch an action to save the task to your backend
    console.log("New task added:", newTask);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-6xl mx-auto p-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-10 bg-gray-100 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-1/4"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-20"></div>
                <div className="h-6 bg-gray-100 rounded w-full"></div>
              </div>
            ))}
          </div>
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

  // Get source badge color
  const getSourceBadgeColor = (source: string) => {
    const sourceColors: { [key: string]: string } = {
      website: "bg-blue-50 text-blue-700 border-blue-200",
      referral: "bg-green-50 text-green-700 border-green-200",
      social: "bg-purple-50 text-purple-700 border-purple-200",
      email: "bg-orange-50 text-orange-700 border-orange-200",
      "cold call": "bg-gray-50 text-gray-700 border-gray-200",
      advertisement: "bg-pink-50 text-pink-700 border-pink-200",
    };
    return (
      sourceColors[source?.toLowerCase()] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {currentLead.name || "Unnamed Lead"}
                  </h1>
                </div>
                {currentLead.id && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Lead ID: {currentLead.id}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                  Convert
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Tag className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Lead Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentLead.leadType || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Globe className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Source</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentLead.source || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <UserCheck className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentLead.assignedToId || "Unassigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Hash className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Position</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentLead.position || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  Contact Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {currentLead.email || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {currentLead.mobileNumber || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Person
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-gray-400" />
                      {currentLead.contactPersonName || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      {currentLead.organizationId || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </label>
                    <p className="text-sm text-gray-900 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="flex-1">{formatAddress()}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  Requirements
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {currentLead.requirements || "No requirements specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Task Component */}
            <AddTask
              leadId={currentLead.id}
              onTaskCreated={handleTaskCreated}
            />

            {/* Lead Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  Lead Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getSourceBadgeColor(
                      currentLead.source
                    )}`}
                  >
                    {currentLead.source || "Unknown"}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {currentLead.leadType || "Not specified"}
                  </p>
                </div>
                {currentLead.stageId && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage ID
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentLead.stageId}
                    </p>
                  </div>
                )}
                {currentLead.createdBy && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentLead.createdBy}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <span>Send Email</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <span>Schedule Meeting</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <span>Add Note</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <span>View Activity</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Recent Tasks (if any tasks exist) */}
            {tasks.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Tasks ({tasks.length})
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {tasks.slice(0, 3).map((task, index) => (
                    <div
                      key={task.id || index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {task.type.charAt(0).toUpperCase() +
                            task.type.slice(1)}
                          {task.dueDate &&
                            ` • Due: ${new Date(
                              task.dueDate
                            ).toLocaleDateString()}`}
                        </p>
                        {task.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {task.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{task.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {tasks.length > 3 && (
                    <button className="w-full text-sm text-blue-600 hover:text-blue-700 py-2 text-center">
                      View all {tasks.length} tasks
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
