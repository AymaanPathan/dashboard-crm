"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  AlertCircle,
  Bell,
  Save,
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

interface AddTaskProps {
  leadId?: string;
  createdById?: string;
  onTaskCreated?: (task: LeadTask) => void;
  onClose?: () => void;
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
}

const AddTask: React.FC<AddTaskProps> = ({ leadId, createdById, onClose }) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");
  const currentTime = now.format("HH:mm");
  const isAdding = useSelector(
    (state: RootState) => state.leadTasks.loading.addingTask
  );
  const dispatch: RootDispatch = useDispatch();
  const [task, setTask] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    reminderDate: "",
    reminderTime: "",
    reminderOption: "15_minutes",
    status: TaskStatus.pending,
    repeatInterval: TaskRepeatInterval.none,
  });

  const reminderOptions = [
    { value: "no_reminder", label: "No reminder", icon: "🚫" },
    { value: "5_minutes", label: "5 minutes before", icon: "⏰" },
    { value: "1_minute", label: "1 minute before", icon: "⏰" },
    { value: "1_hour", label: "1 hour before", icon: "🕐" },
    { value: "custom", label: "Custom time", icon: "⚙️" },
  ];

  const handleReminderChange = (value: string) => {
    setTask((prev) => ({ ...prev, reminderOption: value }));

    if (value !== "custom") {
      setTask((prev) => ({ ...prev, reminderDate: "", reminderTime: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.dueDate) {
      console.error("Due date is required");
      return;
    }

    // User's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Combine due date and time in user's timezone
    const dueDate = dayjs
      .tz(`${task.dueDate}T${task.dueTime || "00:00"}`, userTimezone)
      .toDate();

    // Calculate reminder
    let reminder: Date | undefined;

    switch (task.reminderOption) {
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
      case "custom":
        if (task.reminderDate) {
          reminder = dayjs
            .tz(
              `${task.reminderDate}T${task.reminderTime || "00:00"}`,
              userTimezone
            )
            .toDate();
        }
        break;
      case "no_reminder":
      default:
        reminder = undefined;
        break;
    }

    const now = new Date();

    // Create task object
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
    };

    try {
      await dispatch(
        addLeadTaskSlice({ leadId: leadId || "", leadTask: newTask })
      );
      await dispatch(getLeadTasksByLeadIdSlice(leadId || ""));
      await dispatch(getTodayLeadTasksSlice());

      // Reset form
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
      reminderOption: "15_minutes",
      status: TaskStatus.pending,
      repeatInterval: TaskRepeatInterval.none,
    });
  };

  const isFormValid = task.title.trim() && task.dueDate;

  return (
    <div className="h-full flex flex-col">
      {/* Form - Remove duplicate header since parent handles it */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-6 space-y-6 h-full">
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
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-colors"
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
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <Calendar className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <input
                  type="time"
                  min={task.dueDate === today ? currentTime : undefined}
                  value={task.dueTime}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueTime: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <Clock className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminder
            </label>
            <div className="relative">
              <select
                value={task.reminderOption}
                onChange={(e) => handleReminderChange(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-12"
              >
                {reminderOptions.map((reminder) => (
                  <option key={reminder.value} value={reminder.value}>
                    {reminder.icon} {reminder.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Custom Time Selector */}
            {task.reminderOption === "custom" && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Set custom reminder time
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="date"
                      value={task.reminderDate}
                      onChange={(e) =>
                        setTask((prev) => ({
                          ...prev,
                          reminderDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <Calendar className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      value={task.reminderTime}
                      onChange={(e) =>
                        setTask((prev) => ({
                          ...prev,
                          reminderTime: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <Clock className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-700">
                    Set your preferred reminder date and time
                  </span>
                </div>
              </div>
            )}
          </div>

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
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-400"
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
          <div className="flex gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isAdding || !isFormValid}
              className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
        </form>
      </div>
    </div>
  );
};

export default AddTask;
