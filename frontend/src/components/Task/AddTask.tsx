"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  AlertCircle,
  Bell,
  X,
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
      label: "Toast",
      icon: Layout,
      description: "Corner notification",
    },
    {
      value: NotificationDisplayType.modal,
      label: "Modal",
      icon: Maximize2,
      description: "Center popup",
    },
    {
      value: NotificationDisplayType.sidebar,
      label: "Sidebar",
      icon: Sidebar,
      description: "Side panel",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Add task</h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-4">
          {/* Task Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={task.title}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Task name"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Due Date and Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Due</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  min={today}
                  type="date"
                  required
                  value={task.dueDate}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300 pr-9"
                />
                <Calendar className="absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <input
                  type="time"
                  min={getMinTime()}
                  value={task.dueTime}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueTime: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300 pr-9"
                />
                <Clock className="absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reminder */}
          {canSetReminders && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                Reminder
              </label>
              <div className="relative">
                <select
                  value={task.reminderOption}
                  onChange={(e) => handleReminderChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300 appearance-none cursor-pointer pr-9"
                >
                  {reminderOptions.map((reminder) => (
                    <option key={reminder.value} value={reminder.value}>
                      {reminder.icon} {reminder.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Notification Display Type */}
          {hasActiveReminder && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Display as
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {notificationOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`relative flex items-center gap-2.5 p-2.5 rounded-md border cursor-pointer transition-colors ${
                        task.notificationDisplay === option.value
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
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
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${
                          task.notificationDisplay === option.value
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {option.description}
                        </div>
                      </div>
                      {task.notificationDisplay === option.value && (
                        <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full px-3 py-2 bg-gray-50 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
              >
                <Eye className="w-3.5 h-3.5" />
                {showPreview ? "Hide preview" : "Show preview"}
              </button>
            </div>
          )}

          {/* Preview Display */}
          {showPreview && hasActiveReminder && (
            <div className="bg-gray-900 rounded-md p-4 border border-gray-800">
              <div className="text-center">
                <h3 className="text-xs font-medium text-white mb-0.5">
                  Preview
                </h3>
                <p className="text-[11px] text-gray-400">
                  How your reminder will appear
                </p>
              </div>
            </div>
          )}

          {/* No Reminder Available Message */}
          {!canSetReminders && task.dueDate && (
            <div className="flex items-start gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-md">
              <AlertCircle className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-orange-700">
                No reminder options available - due date is too close
              </span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={task.description}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Add details..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300 resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Validation Message */}
          {!isFormValid && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-amber-700">
                Title and due date are required
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-5 py-3 border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={resetForm}
          className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isAdding || !isFormValid}
          className="flex-1 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating...
            </>
          ) : (
            "Create task"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddTask;
