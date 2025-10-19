import { TaskStats } from "@/models/lead.model";
import { LeadTask } from "@/models/leadTask.model";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const TodayScheduleComponent: React.FC<{
  taskStats: TaskStats;
}> = ({ taskStats }) => {
  console.log("Today's Schedule Tasks:", taskStats.todaysSchedule);
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
      <h3 className="text-[15px] font-semibold text-[#37352f] mb-4">
        Today&apos;s Schedule
      </h3>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent hover:scrollbar-thumb-black/20">
        {taskStats.todaysSchedule && taskStats.todaysSchedule.length > 0 ? (
          taskStats.todaysSchedule.map((task: LeadTask) => (
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
                <Link href={`lead/${task.lead?.id}`}>
                  <span className="text-[11px] text-black/30 font-normal">
                   <ArrowBigRight size={12} />
                  </span>
                </Link>
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
  );
};
