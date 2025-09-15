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
    (state: RootState) => state.leadTasks.myIncompleteTasks
  );
  const myPendingTaskCount = useSelector(
    (state: RootState) => state.leadTasks.myIncompleteTaskCount
  );
  console.log("PendingTasksComponent pendingTasks:", pendingTasks);
  console.log("PendingTasksComponent myPendingTaskCount:", myPendingTaskCount);

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pending Tasks</h2>
        </div>
      </div>

      {pendingTasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={handleComplete} />
      ))}
    </div>
  );
};
