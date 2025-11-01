import { CheckCircle } from "lucide-react";
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

  const handleComplete = (taskId: string) => {
    console.log("Completing task:", taskId);
  };

  if (pendingTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-lg bg-muted mb-6">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {searchQuery ? "No matching pending tasks" : "No pending tasks"}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          {searchQuery
            ? `No pending tasks match "${searchQuery}". Try adjusting your search.`
            : "Great work! All tasks are either completed or actively being worked on."}
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
