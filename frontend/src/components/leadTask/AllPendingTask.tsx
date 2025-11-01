import { Calendar, CheckCircle } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const PendingTasksComponent = ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  const pendingTasks = useSelector(
    (state: RootState) => state.leadTasks.myPendingTasksToday
  );

  if (pendingTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-3 rounded-lg bg-gray-50 mb-4">
          <Calendar className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {searchQuery ? "No tasks match your search" : "No pending tasks"}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {searchQuery
            ? `We couldn’t find any tasks for “${searchQuery}”. Try changing your keywords or filters.`
            : "You’re all caught up! No pending tasks for now — create a new one to stay ahead."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-3 
        max-h-80 
        overflow-y-auto 
        pr-1
        scrollbar-thin 
        scrollbar-thumb-gray-300 
        scrollbar-track-transparent 
        hover:scrollbar-thumb-gray-400
      "
    >
      {pendingTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
