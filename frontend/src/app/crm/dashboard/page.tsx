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
import { LeadStatsComponent } from "@/components/dashboard/LeadStats";
import { TaskStatsComponent } from "@/components/dashboard/TaskStats";
import { LeadDistributionComponent } from "@/components/dashboard/LeadDistribution";
import { TodayScheduleComponent } from "@/components/dashboard/todaySchedule";

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

// Top performing users
const topPerformers = [
  { name: "Rajesh Kumar", leads: 48, conversions: 18, revenue: 156000 },
  { name: "Priya Sharma", leads: 42, conversions: 15, revenue: 142000 },
  { name: "Amit Patel", leads: 38, conversions: 12, revenue: 128000 },
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

      <div className="px-8 py-8 max-w-[1600px] mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <LeadStatsComponent leadStats={leadStats} />
          <TaskStatsComponent taskStats={taskStats} />
          <Calendar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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

          <TodayScheduleComponent taskStats={taskStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadDistributionComponent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            leadStats={leadStats}
          />
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
