/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { MoreVertical, TrendingUp, RefreshCw } from "lucide-react";
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
import {
  getLeadStatus,
  getRevenueStatus,
  getTaskStatus,
} from "@/store/slices/dashboardSlice";
import { connectSocket } from "@/lib/socket";
import { LeadStatsComponent } from "@/components/dashboard/LeadStats";
import { TaskStatsComponent } from "@/components/dashboard/TaskStats";
import { LeadDistributionComponent } from "@/components/dashboard/LeadDistribution";
import { TodayScheduleComponent } from "@/components/dashboard/todaySchedule";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"type" | "source" | "stage">(
    "type"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("1M");
  console.log("Selected Filter:", selectedFilter);
  const revenueData = useSelector(
    (state: RootState) => state.dashboard.revenueData
  );
  console.log("Revenue Data:", revenueData);

  const dispatch: RootDispatch = useDispatch();
  const leadStats = useSelector(
    (state: RootState) => state.dashboard.leadStats
  );
  const taskStats = useSelector(
    (state: RootState) => state.dashboard.taskStats
  );

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([dispatch(getLeadStatus()), dispatch(getTaskStatus())]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    dispatch(getLeadStatus());
    dispatch(getTaskStatus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRevenueStatus(selectedFilter));
  }, [dispatch, selectedFilter]);

  useEffect(() => {
    const socket = connectSocket();
    socket?.on("lead:created", (data: any) => {
      if (data) {
        dispatch(getLeadStatus());
      }
    });
    socket?.on("task:updated", (data: any) => {
      if (data) {
        dispatch(getTaskStatus());
      }
    });
  }, [dispatch]);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  return (
    <div className="min-h-screen ">
      <div className="px-6 py-6 max-w-[1600px] mx-auto">
        {/* Action Bar */}
        <div className="flex items-center gap-2.5 mb-6">
          <button className="flex items-center cursor-pointer gap-2 px-3.5 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-900 transition-all text-sm font-medium shadow-lg shadow-gray-900/10">
            <span>Ask AI</span>
          </button>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200/50 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Last updated now
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex  cursor-pointer items-center gap-2 px-3.5 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-900 transition-all text-sm font-medium shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <LeadStatsComponent leadStats={leadStats} />
          <TaskStatsComponent taskStats={taskStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Revenue
                  </h3>
                </div>
                {/* <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(revenueData.totalRevenue)}{" "}
                  <span className={`text-sm font-medium ${growthColor}`}>
                    {revenueData.growthPercent > 0 ? "+" : ""}
                    {revenueData.growthPercent.toFixed(0)}%
                  </span>
                </div> */}
                <p className="text-xs text-gray-500 mt-0.5">
                  vs previous period
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50 shadow-sm">
                {(["1M", "6M", "1Y"] as any)?.map((filter: any) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    // disabled={isLoadingRevenue}
                    className={`px-2.5 cursor-pointer py-1 text-xs font-medium rounded transition-all ${
                      selectedFilter === filter
                        ? "bg-gray-900/90 backdrop-blur-sm text-white shadow-md"
                        : "text-gray-600 hover:bg-white/80 hover:shadow-sm"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData?.chartData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#e5e7eb"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#e5e7eb"
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <TodayScheduleComponent taskStats={taskStats} />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LeadDistributionComponent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            leadStats={leadStats}
          />

          {/* Top Performers */}
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Top Performers
              </h3>
              <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  name: "Rajesh Kumar",
                  leads: 48,
                  conversions: 18,
                  revenue: 156000,
                },
                {
                  name: "Priya Sharma",
                  leads: 42,
                  conversions: 15,
                  revenue: 142000,
                },
                {
                  name: "Amit Patel",
                  leads: 38,
                  conversions: 12,
                  revenue: 128000,
                },
              ].map((performer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg border border-gray-200/50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-900/90 backdrop-blur-sm flex items-center justify-center text-white text-xs font-semibold shadow-md">
                      {performer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {performer.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {performer.conversions} conversions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(performer.revenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">
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
