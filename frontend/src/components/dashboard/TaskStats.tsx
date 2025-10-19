import { TaskStats } from "@/models/lead.model";
import React from "react";

export const TaskStatsComponent: React.FC<{ taskStats: TaskStats }> = ({
  taskStats,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">Active Tasks</span>
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
  );
};
