"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, ChevronDown, Bell, X, AlignLeft } from "lucide-react";
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

  const isFormValid = task.title.trim() && task.dueDate;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base  font-semibold text-gray-900">New task</h2>
        <button
          onClick={onClose}
          className="p-1 cursor-pointer hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Task Title - Large Input */}
          <div>
            <input
              type="text"
              required
              value={task.title}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Task name"
              className="w-full text-2xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none border-0 p-0"
            />
          </div>

          {/* Properties Grid */}
          <div className="space-y-1">
            {/* Due Date Row */}
            <div className="flex items-center py-2 hover:bg-gray-50 -mx-2 px-2 rounded">
              <div className="flex items-center gap-2 w-32 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Due date</span>
              </div>
              <div className="flex-1">
                <input
                  min={today}
                  type="date"
                  required
                  value={task.dueDate}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="w-full text-sm text-gray-900 focus:outline-none border-0 p-0 bg-transparent"
                />
              </div>
            </div>

            {/* Due Time Row */}
            {task.dueDate && (
              <div className="flex items-center py-2 hover:bg-gray-50 -mx-2 px-2 rounded">
                <div className="flex items-center gap-2 w-32 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Time</span>
                </div>
                <div className="flex-1">
                  <input
                    type="time"
                    min={getMinTime()}
                    value={task.dueTime}
                    onChange={(e) =>
                      setTask((prev) => ({ ...prev, dueTime: e.target.value }))
                    }
                    className="w-full text-sm text-gray-900 focus:outline-none border-0 p-0 bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* Reminder Row */}
            {canSetReminders && (
              <div className="flex items-center py-2 hover:bg-gray-50 -mx-2 px-2 rounded">
                <div className="flex items-center gap-2 w-32 text-sm text-gray-500">
                  <Bell className="w-4 h-4" />
                  <span>Reminder</span>
                </div>
                <div className="flex-1 relative">
                  <select
                    value={task.reminderOption}
                    onChange={(e) => handleReminderChange(e.target.value)}
                    className="w-full text-sm text-gray-900 focus:outline-none border-0 p-0 bg-transparent appearance-none cursor-pointer pr-6"
                  >
                    {reminderOptions.map((reminder) => (
                      <option key={reminder.value} value={reminder.value}>
                        {reminder.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlignLeft className="w-4 h-4" />
              <span>Description</span>
            </div>
            <textarea
              value={task.description}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Add a description..."
              rows={6}
              className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-200 rounded-lg p-3 resize-none hover:border-gray-300 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isAdding || !isFormValid}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? "Creating..." : "Create task"}
        </button>
      </div>
    </div>
  );
};

export default AddTask;
