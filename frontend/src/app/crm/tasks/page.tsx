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
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black text-white">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Tasks
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Total Pipeline
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{allTaskCount}</p>
                  <span className="text-sm text-muted-foreground">tasks</span>
                </div>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Completed</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-emerald-600">
                    {completedCount}
                  </p>
                  <span className="text-sm text-muted-foreground">done</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium">
                  {Math.round((completedCount / allTask.length) * 100)}%
                  completion
                </p>
              </div>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Pending</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-amber-600">
                    {pendingCount}
                  </p>
                  <span className="text-sm text-muted-foreground">waiting</span>
                </div>
                <p className="text-xs text-amber-600 font-medium">
                  Needs attention
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  } flex items-center gap-3 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors`}
                >
                  {tab.label}
                  <span
                    className={`${
                      activeTab === tab.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    } rounded-full px-2.5 py-1 text-xs font-medium`}
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
