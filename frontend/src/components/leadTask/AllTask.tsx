import { Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useSelector } from "react-redux";
import { LeadTask, TaskStatus } from "@/models/leadTask.model";
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

  const completedCount = filteredTasks.filter(
    (task: LeadTask) => task.status === TaskStatus.completed
  ).length;

  const pendingCount = filteredTasks.filter(
    (task: LeadTask) => task.status === TaskStatus.pending
  ).length;

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-3 rounded-lg bg-gray-50 mb-4">
          <Calendar className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {searchQuery ? "No matching tasks found" : "No tasks found"}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {searchQuery
            ? `No tasks match "${searchQuery}". Try adjusting your search.`
            : "Ready to boost your sales pipeline? Create your first task."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task: LeadTask) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
