import { CustomButton } from "@/components/reuseable/Buttons/Button";
import { ReusableList } from "@/components/reuseable/Lists/ReusableList";
import { LeadTask } from "@/models/leadTask.model";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import React from "react";

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-gray-400" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-gray-400" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-300" />;
  }
};

const getStatusBadge = (status: string) => {
  const styles = {
    completed: "bg-gray-100 text-gray-600",
    "in-progress": "bg-gray-50 text-gray-500",
    pending: "bg-gray-50 text-gray-500",
  };
  return styles[status as keyof typeof styles] || styles.pending;
};

interface LeadTaskProps {
  tasks: LeadTask[];
  setShowAddTask: (show: boolean) => void;
}

export const LeadTaskPage: React.FC<LeadTaskProps> = ({
  tasks,
  setShowAddTask,
}) => {
  const columns = [
    {
      key: "title",
      render: (task: LeadTask) => (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-gray-900 truncate">
              {task.title}
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-gray-400 truncate">{task.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      width: "w-28",
      render: (task: LeadTask) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${getStatusBadge(
            task?.status
          )}`}
        >
          {task?.status}
        </span>
      ),
    },
    {
      key: "dueDate",
      width: "w-32",
      render: (task: LeadTask) =>
        task.dueDate ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        ) : null,
    },
  ];

  return (
    <div className=" bg-white">
      {/* Content Section */}
      <div className="mx-auto px-6 py-8">
        {tasks.length > 0 && (
          <div className="mb-6">
            <CustomButton
              onClick={() => setShowAddTask(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </CustomButton>
          </div>
        )}
        <ReusableList
          maxHeight="400px"
          items={tasks}
          columns={columns}
          getItemIcon={(task) => getTaskStatusIcon(task?.status)}
          emptyState={{
            icon: CheckCircle2,
            title: "No tasks yet",
            description: "Create your first task to get started",
            action: {
              label: "Create Task",
              onClick: () => setShowAddTask(true),
            },
          }}
          actions={[
            {
              icon: MoreHorizontal,
              onClick: (task) => console.log("More options", task),
              label: "More options",
            },
          ]}
          onItemClick={(task) => console.log("Clicked task", task)}
          className="overflow-visible"
        />
      </div>
    </div>
  );
};
