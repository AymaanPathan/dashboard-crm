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
      return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-gray-400" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-300" />;
  }
};

const getStatusBadge = (status: string) => {
  const styles = {
    completed: "bg-gray-100 text-gray-600",
    "in-progress": "bg-gray-100 text-gray-600",
    pending: "bg-gray-100 text-gray-500",
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
    <div className="h-full flex flex-col">
      {tasks.length > 0 && (
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New task
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 max-w-4xl">
          {tasks?.length === 0 ? (
            <div className="py-20">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No tasks yet
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first task to get started
                </p>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New task
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
              {tasks.map((task, index) => (
                <div
                  key={task?.id || index}
                  className="group bg-white hover:bg-gray-50 border-b border-gray-100 last:border-b-0 px-4 py-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getTaskStatusIcon(task?.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-gray-900 font-medium mb-1">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-normal ${getStatusBadge(
                                task?.status
                              )}`}
                            >
                              {task?.status}
                            </span>
                            {task.dueDate && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
