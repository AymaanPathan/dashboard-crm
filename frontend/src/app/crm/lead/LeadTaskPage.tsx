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
      return <CheckCircle2 className="h-4 w-4 text-gray-400" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-300" />;
  }
};

const getStatusBadge = (status: string) => {
  const styles = {
    completed: "bg-gray-50 text-gray-600 border-gray-100",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-100",
    pending: "bg-gray-50 text-gray-500 border-gray-100",
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage your lead activities
              </p>
            </div>
            {tasks.length > 0 && (
              <button
                onClick={() => setShowAddTask(true)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto px-8 py-8">
        {tasks?.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No tasks yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={task?.id || index}
                className="group bg-white hover:bg-gray-50 border border-gray-100 rounded-lg p-5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {getTaskStatusIcon(task?.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-900 font-medium mb-1">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(
                              task?.status
                            )}`}
                          >
                            {task?.status}
                          </span>
                          {task.dueDate && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
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
  );
};
