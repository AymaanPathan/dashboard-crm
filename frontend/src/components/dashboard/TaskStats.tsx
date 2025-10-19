import { TaskStats } from "@/models/lead.model";
import React from "react";

export const TaskStatsComponent: React.FC<{ taskStats: TaskStats }> = ({
  taskStats,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200/60 hover:border-gray-300/60 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">Active Tasks</span>
        <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded">
          {taskStats.overdueTasks} overdue
        </span>
      </div>
      <div className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight leading-none">
        {taskStats.totalPendingTasks}
      </div>
      <div className="text-[11px] font-normal text-gray-500">
        {taskStats.todaysPendingTasks} due today
      </div>
    </div>
  );
};
