/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomButton } from "@/components/reuseable/Buttons/Button";
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";
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
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-amber-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusBadge = (status: string) => {
  const styles = {
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "in-progress": "bg-amber-50 text-amber-700 border border-amber-100",
    pending: "bg-gray-50 text-gray-600 border border-gray-200",
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
  const headers = [
    { label: "Task", key: "title" },
    { label: "Status", key: "status" },
    { label: "Due Date", key: "dueDate" },
    { label: "Actions", key: "actions" },
  ];

  const renderRow = (task: LeadTask, index: number) => (
    <>
      {/* Task Info with Icon */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {getTaskStatusIcon(task?.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 mb-0.5">
              {task.title}
            </div>
            {task.description && (
              <p className="text-xs text-gray-500 truncate">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${getStatusBadge(
            task?.status
          )}`}
        >
          {task?.status?.replace("-", " ")}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-5 py-4">
        {task.dueDate ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-900">
            <Calendar className="h-4 w-4 text-gray-400" />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log("More options", task)}
            className="p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95"
            title="More options"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="min-h-screen">
      {/* Content Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {tasks.length > 0 && (
          <div className="mb-6">
            <CustomButton
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-150 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </CustomButton>
          </div>
        )}

        <ReusableListPage
          data={tasks}
          headers={headers}
          renderRow={renderRow}
          onAddClick={() => setShowAddTask(true)}
          emptyState={{
            title: "No tasks found",
            description: "Create your first task to get started",
            actionText: "Create Task",
          }}
        />
      </div>
    </div>
  );
};
