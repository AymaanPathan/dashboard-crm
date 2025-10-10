"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  AlertCircle,
  Bell,
  Save,
  Eye,
  Maximize2,
  Sidebar,
  Layout,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import {
  addLeadTaskSlice,
  getLeadTasksByLeadIdSlice,
  getTodayLeadTasksSlice,
} from "@/store/slices/leadTaskSlice";
import {
  LeadTask,
  TaskStatus,
  TaskRepeatInterval,
} from "@/models/leadTask.model";
import { getAvailableReminderOptions } from "@/utils/getAvailableReminderOptions";

interface AddTaskProps {
  leadId?: string;
  createdById?: string;
  onTaskCreated?: (task: LeadTask) => void;
  onClose?: () => void;
}

enum NotificationDisplayType {
  toaster = "toaster",
  modal = "modal",
  sidebar = "sidebar",
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  reminderDate: string;
  reminderTime: string;
  reminderOption: string;
  status: TaskStatus;
  repeatInterval: TaskRepeatInterval;
  notificationDisplay: NotificationDisplayType;
}

const AddTask: React.FC<AddTaskProps> = ({ leadId, createdById, onClose }) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");
  const isAdding = useSelector(
    (state: RootState) => state.leadTasks.loading.addLeadTask
  );
  const dispatch: RootDispatch = useDispatch();
  const [showPreview, setShowPreview] = useState(false);

  const [task, setTask] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    reminderDate: "",
    reminderTime: "",
    reminderOption: "no_reminder",
    status: TaskStatus.pending,
    repeatInterval: TaskRepeatInterval.none,
    notificationDisplay: NotificationDisplayType.toaster,
  });

  const reminderOptions = useMemo(
    () => getAvailableReminderOptions(task.dueDate, task.dueTime, userTimezone),
    [task.dueDate, task.dueTime, userTimezone]
  );

  useEffect(() => {
    const isCurrentOptionAvailable = reminderOptions.some(
      (option) => option.value === task.reminderOption
    );

    if (!isCurrentOptionAvailable && reminderOptions.length > 0) {
      setTask((prev) => ({
        ...prev,
        reminderOption: reminderOptions[0]?.value || "no_reminder",
      }));
    }
  }, [task.dueDate, task.dueTime, task.reminderOption, reminderOptions]);

  const getMinTime = () => {
    if (task.dueDate === today) {
      const bufferTime = dayjs().add(1, "minute");
      return bufferTime.format("HH:mm");
    }
    return undefined;
  };

  const canSetReminders = reminderOptions.length > 1;
  const hasActiveReminder = task.reminderOption !== "no_reminder";

  const handleReminderChange = (value: string) => {
    setTask((prev) => ({ ...prev, reminderOption: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.dueDate) {
      console.error("Due date is required");
      return;
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dueDate = dayjs
      .tz(`${task.dueDate}T${task.dueTime || "00:00"}`, userTimezone)
      .toDate();

    let reminder: Date | undefined;

    switch (task.reminderOption) {
      case "1_minute":
        reminder = dayjs(dueDate).subtract(1, "minute").toDate();
        break;
      case "5_minutes":
        reminder = dayjs(dueDate).subtract(5, "minute").toDate();
        break;
      case "15_minutes":
        reminder = dayjs(dueDate).subtract(15, "minute").toDate();
        break;
      case "1_hour":
        reminder = dayjs(dueDate).subtract(1, "hour").toDate();
        break;
      case "1_day":
        reminder = dayjs(dueDate).subtract(1, "day").toDate();
        break;
      case "no_reminder":
      default:
        reminder = undefined;
        break;
    }

    if (reminder && dayjs(reminder).isBefore(dayjs())) {
      alert("Reminder is in the past. Please select a valid time.");
      return;
    }

    const now = new Date();

    const newTask: LeadTask = {
      title: task.title,
      description: task.description,
      dueDate,
      reminder: reminder || null,
      status: task.status,
      repeatInterval: task.repeatInterval,
      reminderOption: task.reminderOption,
      createdAt: now,
      updatedAt: now,
      leadId: leadId || "",
      createdById: createdById || "",
      timezone: userTimezone,
      createdBy: null,
    };

    try {
      await dispatch(
        addLeadTaskSlice({ leadId: leadId || "", leadTask: newTask })
      );
      await dispatch(getLeadTasksByLeadIdSlice(leadId || ""));
      await dispatch(getTodayLeadTasksSlice());

      setTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        reminderDate: "",
        reminderTime: "",
        reminderOption: "no_reminder",
        status: TaskStatus.pending,
        repeatInterval: TaskRepeatInterval.none,
        notificationDisplay: NotificationDisplayType.toaster,
      });

      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      reminderDate: "",
      reminderTime: "",
      reminderOption: "no_reminder",
      status: TaskStatus.pending,
      repeatInterval: TaskRepeatInterval.none,
      notificationDisplay: NotificationDisplayType.toaster,
    });
  };

  const isFormValid = task.title.trim() && task.dueDate;

  const notificationOptions = [
    {
      value: NotificationDisplayType.toaster,
      label: "Toast Notification",
      icon: Layout,
      description: "Subtle notification in corner",
    },
    {
      value: NotificationDisplayType.modal,
      label: "Modal Dialog",
      icon: Maximize2,
      description: "Full attention popup",
    },
    {
      value: NotificationDisplayType.sidebar,
      label: "Sidebar Panel",
      icon: Sidebar,
      description: "Persistent side panel",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={task.title}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all bg-white"
            />
          </div>

          {/* Due Date and Time */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  min={today}
                  type="date"
                  required
                  value={task.dueDate}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white"
                />
                <Calendar className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <input
                  type="time"
                  min={getMinTime()}
                  value={task.dueTime}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueTime: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white"
                />
                <Clock className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reminder */}
          {canSetReminders && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Reminder
              </label>
              <div className="relative">
                <select
                  value={task.reminderOption}
                  onChange={(e) => handleReminderChange(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-12 bg-white"
                >
                  {reminderOptions.map((reminder) => (
                    <option key={reminder.value} value={reminder.value}>
                      {reminder.icon} {reminder.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Notification Display Type */}
          {hasActiveReminder && (
            <div className="space-y-3 bg-white rounded-xl p-4 border border-gray-200">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Notification Style
              </label>
              <div className="grid grid-cols-1 gap-2">
                {notificationOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`relative flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        task.notificationDisplay === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="notificationDisplay"
                        value={option.value}
                        checked={task.notificationDisplay === option.value}
                        onChange={(e) =>
                          setTask((prev) => ({
                            ...prev,
                            notificationDisplay: e.target
                              .value as NotificationDisplayType,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          task.notificationDisplay === option.value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.description}
                        </div>
                      </div>
                      {task.notificationDisplay === option.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all flex items-center justify-center gap-2 border border-blue-200"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Preview Notification"}
              </button>
            </div>
          )}

          {/* Preview Display */}
          {showPreview && hasActiveReminder && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Preview
                </h3>
                <p className="text-xs text-gray-400">
                  How your reminder will appear
                </p>
              </div>
            </div>
          )}

          {/* No Reminder Available Message */}
          {!canSetReminders && task.dueDate && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <span className="text-sm text-orange-700">
                No reminder options available - due date is too close to current
                time
              </span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={task.description}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Add any additional details..."
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-400 bg-white"
            />
          </div>

          {/* Validation Message */}
          {!isFormValid && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span className="text-sm text-amber-700">
                Task title and due date are required
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAdding || !isFormValid}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {isAdding ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
