"use client";
import React, { useState, useEffect } from "react";

import { IReminderData } from "@/models/LeadTaskReminder.model";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskReminderStatusSlice } from "@/store/slices/leadTaskSlice";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderData: IReminderData | null;
  onAction?: (action: string, reminderId?: string) => void;
  onRemoveReminder: (taskId: string) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  reminderData,
  onAction,
  onRemoveReminder,
}) => {
  const dispatch: RootDispatch = useDispatch();
  const [isClosing, setIsClosing] = useState(false);
  const reminderList = useSelector(
    (state: RootState) => state.leadTasks.reminderList
  );
  console.log("🔔 ReminderModal rendered", reminderList);
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

  const handleCloseAll = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      reminderList.forEach((reminder) => {
        onRemoveReminder(reminder.taskId || "");
      });
      onClose();
    }, 200);
  };

  const updateReminderStatus = async (status: string, reminderId?: string) => {
    await dispatch(
      updateTaskReminderStatusSlice({ taskId: reminderId || "", status })
    );
    onRemoveReminder(reminderId || "");
  };

  if (!isOpen || !reminderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-4 pr-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/10 transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleCloseAll}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 ${
          isClosing ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <h2 className="text-sm font-semibold text-gray-900">
                Reminders ({reminderList.length})
              </h2>
            </div>
            <button
              onClick={handleCloseAll}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-all"
            >
              Close all
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[600px] overflow-y-auto">
          {reminderList &&
            reminderList.length > 0 &&
            reminderList.map((data, index) => {
              return (
                <div
                  key={data.taskId}
                  className="px-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="space-y-3">
                    <p className="text-sm text-gray-900 leading-relaxed font-medium">
                      {data?.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateReminderStatus("seen", data.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => onRemoveReminder(data.taskId || "")}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Snooze
                      </button>
                      <button
                        onClick={() => onRemoveReminder(data.taskId || "")}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty state if no reminders */}
        {(!reminderList || reminderList.length === 0) && (
          <div className="px-4 py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">No reminders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderModal;
