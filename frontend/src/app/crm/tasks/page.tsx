"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Plus,
  Filter,
  Search,
  Zap,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";

import { TodayTasksComponent } from "@/components/leadTask/todayTask";
import { PendingTasksComponent } from "@/components/leadTask/PendingTask";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMyTasksSlice,
  getIncompleteTasksSlice,
  getTodayLeadTasksSlice,
} from "@/store/slices/leadTaskSlice";
import { TaskStatus } from "@/models/leadTask.model";
import { AllTasksComponent } from "@/components/leadTask/AllTask";

const TasksDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const todaysTaskCount = useSelector(
    (state: RootState) => state.leadTasks.todaysTasks.length
  );
  const allTask = useSelector((state: RootState) => state.leadTasks.myAllTasks);
  const allTaskCount = useSelector(
    (state: RootState) => state.leadTasks.allTaskCount
  );

  const dispatch: RootDispatch = useDispatch();

  useEffect(() => {
    dispatch(getIncompleteTasksSlice());
    dispatch(getTodayLeadTasksSlice());
    dispatch(getAllMyTasksSlice());
  }, [dispatch]);

  const completedCount = allTask.filter(
    (task) => task.status === TaskStatus.completed
  ).length;

  const pendingCount = allTask.filter(
    (task) => task.status === TaskStatus.pending
  ).length;

  const tabs = [
    { id: "today", label: "Today", count: todaysTaskCount },
    { id: "all", label: "All Tasks", count: allTaskCount },
    { id: "pending", label: "Pending", count: pendingCount },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "today":
        return <TodayTasksComponent searchQuery={searchQuery} />;
      case "all":
        return <AllTasksComponent searchQuery={searchQuery} />;
      case "pending":
        return <PendingTasksComponent searchQuery={searchQuery} />;
      default:
        return <TodayTasksComponent searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-6 py-6 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold text-gray-900">Tasks</h1>
              <span className="text-xs text-gray-500 font-normal">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 w-64 rounded-lg border border-gray-200/50 bg-white/60 backdrop-blur-sm text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300/50 focus:bg-white/80 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-[1600px] mx-auto">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Total Pipeline
                </h3>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-semibold text-gray-900">
                {allTaskCount}
              </p>
              <span className="text-xs text-gray-500">tasks</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-600" />
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Completed
                </h3>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <p className="text-2xl font-semibold text-gray-900">
                {completedCount}
              </p>
              <span className="text-xs text-gray-500">done</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {Math.round((completedCount / allTask.length) * 100)}% completion
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Pending
                </h3>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <p className="text-2xl font-semibold text-gray-900">
                {pendingCount}
              </p>
              <span className="text-xs text-gray-500">waiting</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Needs attention</p>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200/50">
            <nav className="flex gap-1 px-2 pt-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-gray-900/90  text-white shadow-md"
                      : "text-gray-600 hover:bg-white/80 hover:shadow-sm"
                  } flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all mb-2`}
                >
                  {tab.label}
                  <span
                    className={`${
                      activeTab === tab.id
                        ? " text-white"
                        : "bg-gray-100 text-gray-500"
                    } rounded px-1.5 py-0.5 text-xs font-medium`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dynamic Content */}
          <div className="p-5">{renderActiveComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TasksDashboard;
