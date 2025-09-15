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

  const handleComplete = (taskId: string) => {
    console.log("Completing task:", taskId);
    // Handle completion logic here
  };

  if (todayTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-lg bg-muted mb-6">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {searchQuery ? "No matching tasks for today" : "No tasks for today"}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          {searchQuery
            ? `No tasks match "${searchQuery}" for today. Try adjusting your search.`
            : "You're ahead of schedule! All today's tasks are complete."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Today&apos;s Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} due
            today
          </p>
        </div>
      </div>

      {todayTasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={handleComplete} />
      ))}
    </div>
  );
};
