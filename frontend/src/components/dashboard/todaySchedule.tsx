import { TaskStats } from "@/models/lead.model";
import { LeadTask } from "@/models/leadTask.model";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const TodayScheduleComponent: React.FC<{
  taskStats: TaskStats;
}> = ({ taskStats }) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Today&apos;s Schedule
      </h3>

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {taskStats.todaysSchedule && taskStats.todaysSchedule.length > 0 ? (
          taskStats.todaysSchedule.map((task: LeadTask) => (
            <div
              key={task.id}
              className="bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg p-3.5 border border-gray-200/50 hover:border-gray-300/50 transition-all  shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs text-gray-500 font-medium bg-white/60 backdrop-blur-sm px-2 py-1 rounded border border-gray-200/50">
                  {new Date(task.dueDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
              </div>

              <h4 className="font-medium text-sm text-gray-900 mb-1.5 leading-tight">
                {task.title || "Untitled Task"}
              </h4>

              <p className="text-xs text-gray-600 leading-relaxed mb-2.5 line-clamp-2">
                {task.description || "No description available"}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                <span className="text-xs text-gray-500 font-medium">
                  {task.lead?.name || "Unknown"}
                </span>
                <Link href={`lead/${task.lead?.id}`}>
                  <button className="flex cursor-pointer items-center gap-1 text-xs text-gray-700 font-medium hover:text-gray-900 transition-colors bg-white/60 backdrop-blur-sm hover:bg-white/80 px-2 py-1 rounded border border-gray-200/50">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/40 backdrop-blur-sm rounded-lg border border-gray-200/50">
            <p className="text-sm text-gray-500 font-medium">
              No tasks scheduled for today
            </p>
            <p className="text-xs text-gray-400 mt-1">
              You&apos;re all caught up
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
