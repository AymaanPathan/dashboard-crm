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
    <div className="min-h-screen bg-[#ffffff]">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Tasks
                  </h1>
                  <p className="text-sm text-gray-500 font-normal">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 w-64 rounded-md border-0 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all"
                />
              </div>

              <Button
                size="sm"
                className="gap-1.5 h-8 text-sm font-normal bg-gray-900 hover:bg-gray-800 text-white rounded-md shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-12 py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-shadow">
            <div className="p-5 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total Pipeline
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-semibold text-gray-900">
                    {allTaskCount}
                  </p>
                  <span className="text-sm text-gray-400">tasks</span>
                </div>
              </div>
              <Activity className="h-4 w-4 text-gray-300" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-shadow">
            <div className="p-5 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Completed
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-semibold text-green-600">
                    {completedCount}
                  </p>
                  <span className="text-sm text-gray-400">done</span>
                </div>
                <p className="text-xs text-green-600 font-medium">
                  {Math.round((completedCount / allTask.length) * 100)}%
                  completion
                </p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-shadow">
            <div className="p-5 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Pending
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-semibold text-amber-600">
                    {pendingCount}
                  </p>
                  <span className="text-sm text-gray-400">waiting</span>
                </div>
                <p className="text-xs text-amber-600 font-medium">
                  Needs attention
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="rounded-lg border border-gray-100 bg-white">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100">
            <nav className="flex px-1" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  } flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors`}
                >
                  {tab.label}
                  <span
                    className={`${
                      activeTab === tab.id
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-50 text-gray-500"
                    } rounded-md px-2 py-0.5 text-xs font-medium`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dynamic Content */}
          <div className="p-6">{renderActiveComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TasksDashboard;
