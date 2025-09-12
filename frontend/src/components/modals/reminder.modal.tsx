"use client";
import React, { useState, useEffect } from "react";

import { IReminderData } from "@/models/LeadTaskReminder.model";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderData: IReminderData | null;
  onAction?: (action: string, reminderId?: string) => void;
  reminderList: IReminderData[];
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  reminderData,
  onAction,
  reminderList,
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
        {reminderList &&
          reminderList.length > 0 &&
          reminderList.map((data) => {
            return (
              <div key={data.taskId} className="p-6 border-b last:border-0">
                <div className="flex items-start">
                  <div className={`flex-shrink-0  text-white p-2 rounded-lg`}>
                    {data?.message}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ReminderModal;
