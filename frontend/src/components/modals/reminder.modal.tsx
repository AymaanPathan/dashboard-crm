"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  AlarmSmokeIcon,
  Archive,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";

interface ReminderData {
  id?: string;
  title: string;
  description?: string;
  type: "task" | "meeting" | "follow-up" | "deadline";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  leadName?: string;
  leadId?: string;
  timestamp: string;
}

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderData: ReminderData | null;
  onAction?: (action: string, reminderId?: string) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  reminderData,
  onAction,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, reminderData?.id);
    }
    handleClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-5 w-5" />;
      case "meeting":
        return <Calendar className="h-5 w-5" />;
      case "follow-up":
        return <User className="h-5 w-5" />;
      case "deadline":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 7 && diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (!isOpen || !reminderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-200 ${
          isClosing
            ? "opacity-0 scale-95 translate-y-4"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${getPriorityColor(
                  reminderData.priority
                )} bg-opacity-10`}
              >
                <div
                  className={`${getPriorityColor(
                    reminderData.priority
                  )} bg-opacity-100 rounded-lg p-1.5 text-white`}
                >
                  {getTypeIcon(reminderData.type)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reminder
                  </h2>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      reminderData.priority === "urgent"
                        ? "bg-red-100 text-red-700"
                        : reminderData.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : reminderData.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {reminderData.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(reminderData.timestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  /* Handle more options */
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 leading-6">
                {reminderData.title}
              </h3>
              {reminderData.description && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {reminderData.description}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {reminderData.leadName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Lead
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {reminderData.leadName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {reminderData.type}
                </span>
              </div>

              {reminderData.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Due</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(reminderData.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-2">
            {/* Primary Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("complete")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </button>
              <button
                onClick={() => handleAction("view")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAction("snooze")}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
              >
                <AlarmSmokeIcon className="h-3.5 w-3.5" />
                Snooze
              </button>
              <button
                onClick={() => handleAction("reschedule")}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
              >
                <Calendar className="h-3.5 w-3.5" />
                Reschedule
              </button>
              <button
                onClick={() => handleAction("dismiss")}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
              >
                <Archive className="h-3.5 w-3.5" />
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Floating Bell Animation */}
        <div className="absolute -top-3 -right-3 animate-bounce">
          <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
            <Bell className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
