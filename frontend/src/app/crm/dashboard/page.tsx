/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
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
import { getLeadStatus } from "@/store/slices/dashboardSlice";
import { connectSocket } from "@/lib/socket";

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
  const dispatch: RootDispatch = useDispatch();
  const leadStats = useSelector(
    (state: RootState) => state.dashboard.leadStats
  );
  console.log("Lead Stats from Redux:", leadStats);

  useEffect(() => {
    dispatch(getLeadStatus());
  }, [dispatch]);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("lead:created", (data: any) => {
      if (data) {
        dispatch(getLeadStatus());
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
                    ? `+${leadStats.percentGrowth}% increase`
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
                + 3%
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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Active Tasks
              </span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[12px] font-medium rounded">
                {taskStats.overdue} overdue
              </span>
            </div>
            <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
              {taskStats.pending}
            </div>
            <div className="text-[12px] text-[#37352f]/50">
              {taskStats.today} due today
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Calendar
              </span>
              <span className="text-[13px] text-[#37352f]/50">June</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-2">
              <div className="text-[#37352f]/40">Sun</div>
              <div className="text-[#37352f]/40">Mon</div>
              <div className="text-[#37352f]/40">Tue</div>
              <div className="text-[#37352f] font-medium">Wed</div>
              <div className="text-[#37352f]/40">Thu</div>
              <div className="text-[#37352f]/40">Fri</div>
              <div className="text-[#37352f]/40">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              <div className="text-[#37352f]/40">7</div>
              <div className="text-[#37352f]/40">8</div>
              <div className=" font-medium bg-[#37352f] text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">
                9
              </div>
              <div className="text-[#37352f]/40">10</div>
              <div className="text-[#37352f]/40">11</div>
            </div>
          </div>
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
            <div className="space-y-5">
              <div className="border-l-2 pl-4 pb-4 border-b border-black/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#37352f]/50 tracking-wide">
                    9:00 AM
                  </span>
                </div>
                <h4 className="font-medium text-[14px] text-[#37352f] mb-1">
                  Follow-up: Acme Corp
                </h4>
                <p className="text-[12px] text-[#37352f]/60">
                  Call regarding quotation #QT-2401
                </p>
              </div>

              <div className="border-l-2  pl-4 pb-4 border-b border-black/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#37352f]/50 tracking-wide">
                    11:30 AM
                  </span>
                </div>
                <h4 className="font-medium text-[14px] text-[#37352f] mb-1">
                  Meeting: Tech Solutions
                </h4>
                <p className="text-[12px] text-[#37352f]/60">
                  Product demo presentation
                </p>
              </div>

              <div className="border-l-2 border-amber-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#37352f]/50 tracking-wide">
                    2:00 PM
                  </span>
                </div>
                <h4 className="font-medium text-[14px] text-[#37352f] mb-1">
                  Task: Global Industries
                </h4>
                <p className="text-[12px] text-[#37352f]/60">
                  Send proposal document
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Leads, Sources, Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <h3 className="text-[15px] font-semibold text-[#37352f] mb-4">
              Lead Distribution
            </h3>
            <div className="flex gap-6 mb-5 text-[13px] border-b border-black/[0.06]">
              <button className="pb-2 border-b-2 border-[#37352f] text-[#37352f] font-medium">
                By Type
              </button>
              <button className="pb-2 text-[#37352f]/50 hover:text-[#37352f]/80 transition-colors">
                By Source
              </button>
              <button className="pb-2 text-[#37352f]/50 hover:text-[#37352f]/80 transition-colors">
                By Stage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-[12px] text-[#37352f]/60">Hot</span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  {leadStats.hot}
                </div>
                <div className="text-[11px] text-[#37352f]/40">
                  43.7% of total
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-[12px] text-[#37352f]/60">Warm</span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  {leadStats.warm}
                </div>
                <div className="text-[11px] text-[#37352f]/40">
                  34.1% of total
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-[12px] text-[#37352f]/60">Cold</span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  {leadStats.cold}
                </div>
                <div className="text-[11px] text-[#37352f]/40">
                  22.2% of total
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[12px] text-[#37352f]/60">
                    Converted
                  </span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  {leadStats.converted}
                </div>
                <div className="text-[11px] text-[#37352f]/40">16.1% rate</div>
              </div>
            </div>

            <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex">
              <div className="bg-red-500" style={{ width: "43.7%" }}></div>
              <div className="bg-amber-500" style={{ width: "34.1%" }}></div>
              <div className="bg-blue-500" style={{ width: "22.2%" }}></div>
            </div>
          </div>

          {/* Lead Sources Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#37352f]">
                Leads by Source
              </h3>
              <button className="p-1 hover:bg-black/[0.03] rounded transition-all duration-200">
                <MoreVertical className="w-4 h-4 text-[#37352f]/40" />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                261
              </div>
              <div className="text-[12px] text-emerald-600">
                +18% vs last month
              </div>
            </div>
            <div className="flex gap-4 text-[12px] mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                <span className="text-[#37352f]/60">Website</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span className="text-[#37352f]/60">Referral</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#37352f]"></div>
                <span className="text-[#37352f]/60">Cold Call</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={leadsBySourceData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#37352f", opacity: 0.5 }}
                  stroke="#37352f"
                  strokeOpacity={0.1}
                />
                <YAxis hide />
                <Bar dataKey="website" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="referral" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cold" fill="#37352f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
