import { LeadTask } from "@/models/leadTask.model";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import React from "react";

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-orange-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusBadge = (status: string) => {
  const styles = {
    completed: "bg-green-100 text-green-700 border-green-200",
    "in-progress": "bg-orange-100 text-orange-700 border-orange-200",
    pending: "bg-gray-100 text-gray-700 border-gray-200",
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
  return (
    <div className="p-6">
      {tasks?.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first task to get started with this lead
          </p>
          <button
            onClick={() => setShowAddTask(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task?.id || index}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getTaskStatusIcon(task?.status)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 pr-4">
                      {task.title}
                    </h4>
                    <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadge(
                        task?.status
                      )}`}
                    >
                      {task?.status}
                    </span>
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
