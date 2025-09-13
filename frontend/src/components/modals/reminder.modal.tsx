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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/5 backdrop-blur-[2px] transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg bg-white border border-gray-200/60 rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
          isClosing
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Reminders</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-50"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {reminderList &&
            reminderList.length > 0 &&
            reminderList.map((data, index) => {
              return (
                <div
                  key={data.taskId}
                  className="px-6 py-4 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {data?.title}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateReminderStatus("seen", data.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    >k
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty state if no reminders */}
        {(!reminderList || reminderList.length === 0) && (
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <p className="text-sm text-gray-500">No reminders at this time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderModal;
