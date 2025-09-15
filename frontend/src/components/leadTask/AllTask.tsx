import { Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useSelector } from "react-redux";
import { LeadTask, TaskStatus } from "@/models/leadTask.model";
import { RootState } from "@/store";

export const AllTasksComponent = ({ searchQuery }: { searchQuery: string }) => {
  const myAllTasks = useSelector(
    (state: RootState) => state.leadTasks.myAllTasks
  );
  console.log("AllTasksComponent myAllTasks:", myAllTasks);
  const filteredTasks = myAllTasks.filter((task: LeadTask) => {
    if (!searchQuery) return true;
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleComplete = (taskId: string) => {
    console.log("Completing task:", taskId);
    // Handle completion logic here
  };

  const completedCount = filteredTasks.filter(
    (task: LeadTask) => task.status === TaskStatus.completed
  ).length;

  const pendingCount = filteredTasks.filter(
    (task: LeadTask) => task.status === TaskStatus.pending
  ).length;

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-lg bg-muted mb-6">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {searchQuery ? "No matching tasks found" : "No tasks found"}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          {searchQuery
            ? `No tasks match "${searchQuery}". Try adjusting your search.`
            : "Ready to boost your sales pipeline? Create your first task."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">All Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount} completed • {pendingCount} pending
          </p>
        </div>
      </div>

      {filteredTasks.map((task: LeadTask) => (
        <TaskCard key={task.id} task={task} onComplete={handleComplete} />
      ))}
    </div>
  );
};
