// components/providers/GlobalReminderProvider.tsx
"use client";

import { useEffect, useState } from "react";
import ReminderModal from "../modals/reminder.modal";
import { connectSocket } from "@/lib/socket";

const GlobalReminderProvider = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderData, setReminderData] = useState<any>(null);
  const [remindersLitst, setRemindersList] = useState<any[]>([]);

  useEffect(() => {
    const socket = connectSocket();

    const handleTaskReminder = (data: any) => {
      console.log("📩 Global reminder received:", data);
      setReminderData(data);
      setRemindersList((prev) => [...prev, data]);
      setShowReminderModal(true);
    };

    socket.on("taskReminder", handleTaskReminder);

    return () => {
      socket.off("taskReminder", handleTaskReminder);
    };
  }, []);
  console.log("🔔 GlobalReminderProvider rendered", remindersLitst);

  return (
    <>
      {showReminderModal && reminderData && (
        <ReminderModal
          reminderList={remindersLitst}
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          reminderData={reminderData}
          onAction={(action, id) => {
            console.log(`Global Action: ${action} | Task ID: ${id}`);
            setShowReminderModal(false);
          }}
        />
      )}
    </>
  );
};

export default GlobalReminderProvider;
