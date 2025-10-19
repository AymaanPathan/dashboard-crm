/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Download,
  Share2,
  Upload,
  Search,
  Home,
  MoreVertical,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getLeadStatus, getTaskStatus } from "@/store/slices/dashboardSlice";
import { connectSocket } from "@/lib/socket";
import Calendar from "@/components/dashboard/Calender";

// Mock data based on Prisma schema
const revenueData = [
  { month: "Mar", value: 145000 },
  { month: "Apr", value: 178000 },
  { month: "May", value: 156000 },
  { month: "Jun", value: 198000 },
  { month: "Jul", value: 223000 },
  { month: "Aug", value: 189000 },
  { month: "Sept", value: 234000 },
  { month: "Oct", value: 267000 },
  { month: "Nov", value: 298000 },
  { month: "Dec", value: 245000 },
  { month: "Jan", value: 289000 },
  { month: "Feb", value: 312000 },
  { month: "Mar", value: 356000 },
];

const leadsBySourceData = [
  { month: "Jan", website: 45, referral: 32, cold: 28 },
  { month: "Feb", website: 52, referral: 38, cold: 31 },
  { month: "Mar", website: 48, referral: 35, cold: 25 },
  { month: "Apr", website: 58, referral: 42, cold: 33 },
  { month: "May", website: 55, referral: 40, cold: 29 },
];

// Lead status breakdown
const leadStats = {
  total: 261,
  hot: 114,
  warm: 89,
  cold: 58,
  converted: 42,
};

// Task metrics
const taskStats = {
  pending: 47,
  completed: 156,
  overdue: 12,
  today: 23,
};

// User/Team metrics
const teamStats = {
  totalUsers: 24,
  activeUsers: 21,
  salesReps: 12,
  telecallers: 8,
  managers: 4,
};

// Lead conversion by stage
const stageConversionData = [
  { stage: "New", count: 45, conversion: 85 },
  { stage: "Contacted", count: 38, conversion: 72 },
  { stage: "Qualified", count: 28, conversion: 65 },
  { stage: "Proposal", count: 22, conversion: 58 },
  { stage: "Negotiation", count: 15, conversion: 45 },
  { stage: "Closed Won", count: 12, conversion: 100 },
];

// Top performing users
const topPerformers = [
  { name: "Rajesh Kumar", leads: 48, conversions: 18, revenue: 156000 },
  { name: "Priya Sharma", leads: 42, conversions: 15, revenue: 142000 },
  { name: "Amit Patel", leads: 38, conversions: 12, revenue: 128000 },
];

// Recent activities
const recentActivities = [
  {
    time: "9:00 AM",
    user: "Rajesh Kumar",
    action: "Created lead",
    lead: "Acme Corp",
  },
  {
    time: "9:15 AM",
    user: "Priya Sharma",
    action: "Updated quotation",
    lead: "Tech Solutions",
  },
  {
    time: "9:30 AM",
    user: "Amit Patel",
    action: "Completed task",
    lead: "Global Industries",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"type" | "source" | "stage">(
    "type"
  );

  const dispatch: RootDispatch = useDispatch();
  const leadStats = useSelector(
    (state: RootState) => state.dashboard.leadStats
  );
  const taskStats = useSelector(
    (state: RootState) => state.dashboard.taskStats
  );
  console.log("Lead Stats from Redux:", leadStats);
  console.log("Task Stats from Redux:", taskStats);

  useEffect(() => {
    dispatch(getLeadStatus());
    dispatch(getTaskStatus());
  }, [dispatch]);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("lead:created", (data: any) => {
      if (data) {
        dispatch(getLeadStatus());
      }
    });
    socket.on("task:updated", (data: any) => {
      if (data) {
        console.log("Received task:updated event:", data);
        dispatch(getTaskStatus());
      }
    });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-black/[0.06] px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <h1 className="text-[28px] font-semibold text-[#37352f] tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-black/[0.03] rounded-md transition-all duration-200">
              <Home className="w-[18px] h-[18px] text-[#37352f]/60" />
            </button>
            <div className="relative">
              <Search className="w-[16px] h-[16px] text-[#37352f]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-black/[0.03] border-none rounded-md text-[14px] text-[#37352f] placeholder:text-[#37352f]/40 w-[240px] focus:outline-none focus:bg-white focus:shadow-sm transition-all duration-200"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/[0.03] rounded-md transition-all duration-200">
              <Share2 className="w-[16px] h-[16px] text-[#37352f]/60" />
              <span className="text-[14px] text-[#37352f]/80">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-[1600px] mx-auto">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-8">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#37352f] text-white rounded-md hover:bg-[#2f2d2a] transition-all duration-200 text-[14px] font-medium shadow-sm">
            <span>Ask AI</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-black/[0.03] rounded-md transition-all duration-200 text-[14px] text-[#37352f]/80 border border-black/[0.06]">
            <span>Customize Widget</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[13px] text-[#37352f]/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Last updated now
            </span>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-black/[0.03] rounded-md transition-all duration-200 text-[14px] text-[#37352f]/80 border border-black/[0.06]">
              <Upload className="w-[15px] h-[15px]" />
              <span>Imports</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#37352f] text-white rounded-md hover:bg-[#2f2d2a] transition-all duration-200 text-[14px] font-medium shadow-sm">
              <Download className="w-[15px] h-[15px]" />
              <span>Exports</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {/* Total Leads Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Total Leads
              </span>
              {leadStats?.percentGrowth !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[12px] font-medium rounded ${
                    leadStats.percentGrowth > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : leadStats.percentGrowth < 0
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {leadStats.percentGrowth > 0
                    ? `+${leadStats.percentGrowth}% vs last month.`
                    : leadStats.percentGrowth < 0
                    ? `${leadStats.percentGrowth}% decrease`
                    : "No change"}
                </span>
              )}
            </div>
            {/* Total Leads */}
            <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
              {leadStats?.totalLeads ?? 0}
            </div>

            <div
              className={`text-[12px] ${
                leadStats.percentGrowth! > 0
                  ? "text-emerald-600"
                  : leadStats.percentGrowth! < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {leadStats?.lastMonthLeads === 0 &&
              leadStats.currentMonthLeads! > 0
                ? `${leadStats.currentMonthLeads} new leads this month`
                : leadStats.percentGrowth! > 0
                ? `More leads than last month`
                : leadStats.percentGrowth! < 0
                ? `Fewer leads than last month`
                : "Same as last month"}
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Conversion Rate
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[12px] font-medium rounded">
                + {leadStats.wonPercentGrowth}% vs last month.
              </span>
            </div>
            <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
              {leadStats.percentWon}%
            </div>
            <div className="text-[12px] text-[#37352f]/50">
              {leadStats.wonLeads} leads converted
            </div>
          </div>

          {/* Active Tasks Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Active Tasks
              </span>
              <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-md">
                {taskStats.overdueTasks} overdue
              </span>
            </div>
            <div className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
              {taskStats.totalPendingTasks}
            </div>
            <div className="text-sm text-gray-400">
              {taskStats.todaysPendingTasks} due today
            </div>
          </div>
          {/* Calendar Card */}
          <Calendar />
        </div>

        {/* Revenue Chart & Calendar Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[13px] font-medium text-[#37352f]/60 mb-1">
                  Total Revenue
                </h3>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  ₹3,56,000{" "}
                  <span className="text-[14px] font-normal text-emerald-600">
                    +22% vs last month
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  1D
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  1W
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  1M
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  6M
                </button>
                <button className="px-2.5 py-1 text-[12px] bg-[#37352f]/90 text-white rounded transition-all duration-200">
                  1Y
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  ALL
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#37352f"
                  strokeOpacity={0.06}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#37352f", opacity: 0.5 }}
                  stroke="#37352f"
                  strokeOpacity={0.1}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#37352f", opacity: 0.5 }}
                  stroke="#37352f"
                  strokeOpacity={0.1}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#37352f"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calendar Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <h3 className="text-[15px] font-semibold text-[#37352f] mb-4">
              Today&apos;s Schedule
            </h3>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent hover:scrollbar-thumb-black/20">
              {taskStats.todaysSchedule &&
              taskStats.todaysSchedule.length > 0 ? (
                taskStats.todaysSchedule.map((task: any) => (
                  <div
                    key={task.id}
                    className="group relative bg-white hover:bg-black/[0.02] rounded-[3px] p-3.5 border border-black/[0.06] transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                        <span className="text-[11px] text-black/40 font-normal">
                          {new Date(task.dueDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-medium text-[14px] text-black/90 mb-1.5 leading-tight">
                      {task.title || "Untitled Task"}
                    </h4>

                    <p className="text-[13px] text-black/50 leading-relaxed mb-2">
                      {task.description || "No description available"}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-black/[0.04]">
                      <span className="text-[11px] text-black/35 font-normal">
                        {task.lead?.name || "Unknown"}
                      </span>
                      <span className="text-[11px] text-black/20">·</span>
                      <span className="text-[11px] text-black/30 font-normal">
                        {task.lead?.company || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[13px] text-black/40 font-normal">
                    No tasks scheduled for today
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row - Leads, Sources, Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <h3 className="text-[15px] font-semibold text-[#37352f] mb-4">
              Lead Distribution
            </h3>

            {/* Tabs */}
            <div className="flex gap-6 mb-5 text-[13px] border-b border-black/[0.06]">
              <button
                onClick={() => setActiveTab("type")}
                className={`pb-2 font-medium ${
                  activeTab === "type"
                    ? "border-b-2 border-[#37352f] text-[#37352f]"
                    : "text-[#37352f]/50 hover:text-[#37352f]/80"
                }`}
              >
                By Type
              </button>
              <button
                onClick={() => setActiveTab("source")}
                className={`pb-2 font-medium ${
                  activeTab === "source"
                    ? "border-b-2 border-[#37352f] text-[#37352f]"
                    : "text-[#37352f]/50 hover:text-[#37352f]/80"
                }`}
              >
                By Source
              </button>
              <button
                onClick={() => setActiveTab("stage")}
                className={`pb-2 font-medium ${
                  activeTab === "stage"
                    ? "border-b-2 border-[#37352f] text-[#37352f]"
                    : "text-[#37352f]/50 hover:text-[#37352f]/80"
                }`}
              >
                By Stage
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {activeTab === "type" &&
                leadStats?.leadDistribution?.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.type === "Hot"
                            ? "bg-red-500"
                            : item.type === "Warm"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <span className="text-[12px] text-[#37352f]/60">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                      {item.count}
                    </div>
                    <div className="text-[11px] text-[#37352f]/40">
                      {item.percentage}% of total
                    </div>
                  </div>
                ))}

              {activeTab === "source" &&
                leadStats?.sourceDistribution?.map(
                  (src, i) =>
                    src.count > 0 && (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                          <span className="text-[12px] text-[#37352f]/60">
                            {src.source}
                          </span>
                        </div>
                        <div className="text-[24px] font-semibold text-[#37352f] tracking-tight">
                          {src.count}
                        </div>
                        <div className="text-[11px] text-[#37352f]/40">
                          {src.percentage}% of total
                        </div>
                      </div>
                    )
                )}

              {activeTab === "stage" &&
                leadStats?.stageDistribution?.map((stage, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      <span className="text-[12px] text-[#37352f]/60">
                        {stage.stage}
                      </span>
                    </div>
                    <div className="text-[24px] font-semibold text-[#37352f] tracking-tight">
                      {stage.count}
                    </div>
                    <div className="text-[11px] text-[#37352f]/40">
                      {stage.percentage}% of total
                    </div>
                  </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex">
              {activeTab === "type" &&
                leadStats?.leadDistribution?.map((item, i) => (
                  <div
                    key={i}
                    className={`${
                      item.type === "Hot"
                        ? "bg-red-500"
                        : item.type === "Warm"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                ))}

              {activeTab === "source" &&
                leadStats?.sourceDistribution?.map((item, i) => (
                  <div
                    key={i}
                    className="bg-emerald-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                ))}

              {activeTab === "stage" &&
                leadStats?.stageDistribution?.map((item, i) => (
                  <div
                    key={i}
                    className="bg-indigo-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                ))}
            </div>

            <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex"></div>
          </div>
          {/* Top Performers */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#37352f]">
                Top Performers
              </h3>
              <button className="p-1 hover:bg-black/[0.03] rounded transition-all duration-200">
                <MoreVertical className="w-4 h-4 text-[#37352f]/40" />
              </button>
            </div>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[12px] font-medium">
                      {performer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#37352f]">
                        {performer.name}
                      </div>
                      <div className="text-[11px] text-[#37352f]/50">
                        {performer.conversions} conversions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-[#37352f]">
                      ₹{(performer.revenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[11px] text-[#37352f]/50">
                      {performer.leads} leads
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
