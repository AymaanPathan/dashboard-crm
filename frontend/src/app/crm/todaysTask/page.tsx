"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { TaskStatus } from "@/models/leadTask.model";

const TodaysTasksPage: React.FC = () => {
  const todaysTask = useSelector(
    (state: RootState) => state.leadTasks.todaysTasks
  );

  const getTaskIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    switch (status?.toLowerCase()) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "in-progress":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "pending":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Today&apos;s Tasks
            </h1>
          </div>
          <p className="text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Tasks Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todaysTask?.length || 0}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {todaysTask?.filter(
                    (task) => task.status?.toLowerCase() === "completed"
                  ).length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {todaysTask?.filter(
                    (task) => task.status?.toLowerCase() === "in-progress"
                  ).length || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {todaysTask?.filter(
                    (task) => task.status?.toLowerCase() === "pending"
                  ).length || 0}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Task Details
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {todaysTask && todaysTask.length > 0 ? (
              todaysTask.map((task) => (
                <div
                  key={task.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getTaskIcon(task.status)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {task.title}
                          </h3>
                          <span className={getStatusBadge(task.status)}>
                            {task.status.replace("_", " ")}
                          </span>
                          {/* {getRepeatBadge(task.repeatInterval)} */}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>

                          {/* {task.reminder && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>
                                Reminder: {formatDateTime(task.reminder)}
                              </span>
                            </div>
                          )} */}

                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Lead ID: {task.leadId}</span>
                          </div>
                        </div>

                        {/* <div className="mt-2 text-xs text-gray-400">
                          Created: {formatDateTime(task.createdAt)} | Updated:{" "}
                          {formatDateTime(task.updatedAt)}
                        </div> */}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Lead
                      </Button>

                      {task.status !== TaskStatus.completed &&
                        task.status !== TaskStatus.cancelled && (
                          <Button
                            variant="default"
                            size="sm"
                            className="text-xs"
                          >
                            Mark Complete
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks for today
                </h3>
                <p className="text-gray-600 mb-4">
                  You&apos;re all caught up! No tasks scheduled for today.
                </p>
                <Button variant="default">Add New Task</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysTasksPage;
