import { Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const TodayTasksComponent = ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  const todayTasks = useSelector(
    (state: RootState) => state.leadTasks.todaysTasks
  );

  if (todayTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-3 rounded-lg bg-gray-50 mb-4">
          <Calendar className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {searchQuery ? "No matching tasks for today" : "No tasks for today"}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {searchQuery
            ? `No tasks match "${searchQuery}" for today. Try adjusting your search.`
            : "You're ahead of schedule! All today's tasks are complete."}
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
      {todayTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
