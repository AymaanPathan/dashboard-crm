"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  Grid3X3,
  List,
  Settings,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Thermometer,
  User,
  MapPin,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";

const LeadsDashboard = () => {
  const [selectedView, setSelectedView] = useState("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch: RootDispatch = useDispatch();
  const currentOrganization = useSelector(
    (state: RootState) => state.org.currentOrganization
  );

  useEffect(() => {
    const getOrganizationData = async () => {
      await dispatch(getOrganizationInfo());
    };

    getOrganizationData();
  }, [ dispatch]);

  console.log(currentOrganization);

  const leads = [
    {
      id: 1,
      company: "B.P.S Infra Solutions",
      location: "Uttar Pradesh - Lucknow",
      status: "Lead",
      temperature: "Warm",
      assignee: "TE",
      avatar: "🏢",
    },
    {
      id: 2,
      company: "Hts Enterprises",
      location: "Uttar Pradesh - Lucknow",
      status: "Lead",
      temperature: "Warm",
      assignee: "TE",
      avatar: "🏭",
    },
    {
      id: 3,
      company: "Greenview Solar Solutions Pvt Ltd",
      location: "Uttar Pradesh - Lucknow",
      status: "Lead",
      temperature: "Warm",
      assignee: "TE",
      avatar: "🌱",
    },
  ];

  const columns = [
    { id: "lead", title: "Lead", count: 3 },
    { id: "followup", title: "Follow-Up", count: 0 },
    { id: "quoted", title: "Quoted", count: 0 },
    { id: "won", title: "Won", count: 0 },
    { id: "assigned", title: "Assigned By Telecaller", count: 0 },
  ];

  const getTemperatureColor = (temp: any) => {
    switch (temp.toLowerCase()) {
      case "hot":
        return "bg-red-100 text-red-700 border-red-200";
      case "warm":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cold":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">F</span>
                </div>
                <span className="font-semibold text-gray-900">Frelit</span>
              </div>

              <nav className="flex space-x-8">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
                >
                  Leads
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  HRMS
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  EPC
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Orders
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Warehouse
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Products
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Bill Of Materials
                </a>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600 hover:text-gray-900 font-medium">
                    Extras
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setSelectedView("kanban")}
                className={`p-2 rounded ${
                  selectedView === "kanban"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={`p-2 rounded ${
                  selectedView === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Type
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
                <option>All Source Types</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
                <option>All Assignees</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
                <option>All States</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                <Calendar className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                Reset Filters
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <span className="text-sm text-blue-600 font-medium">
              Today&apos;s Leads Added: 0
            </span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-white rounded-lg border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
              </div>

              <div className="p-4 space-y-4 min-h-[400px]">
                {column.id === "lead" &&
                  leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {lead.company}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {lead.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getTemperatureColor(
                              lead.temperature
                            )}`}
                          >
                            <Thermometer className="w-3 h-3 inline mr-1" />
                            {lead.temperature}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            {lead.assignee}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {column.count === 0 && column.id !== "lead" && (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <div className="text-sm">No cards in this column</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      <div className="fixed bottom-4 right-4` bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-500 text-xs">✓</span>
        </div>
        <span>Login successful</span>
      </div>
    </div>
  );
};
export default LeadsDashboard;