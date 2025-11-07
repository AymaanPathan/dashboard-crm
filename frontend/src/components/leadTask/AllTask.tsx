import { Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useSelector } from "react-redux";
import { LeadTask } from "@/models/leadTask.model";
import { RootState } from "@/store";

export const AllTasksComponent = ({ searchQuery }: { searchQuery: string }) => {
  const myAllTasks = useSelector(
    (state: RootState) => state.leadTasks.myAllTasks
  );
  const filteredTasks = myAllTasks.filter((task: LeadTask) => {
    if (!searchQuery) return true;
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-3 rounded-lg bg-gray-50 mb-4">
          <Calendar className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {searchQuery ? "No tasks match your search" : "No tasks available"}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {searchQuery
            ? `We couldn’t find any tasks for “${searchQuery}”. Try refining your search or clearing filters.`
            : "You don’t have any tasks yet. Start by creating a new one to stay organized and on track."}
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
      {filteredTasks.map((task: LeadTask) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
