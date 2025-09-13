"use client";

import { useEffect } from "react";
import ReminderModal from "../modals/reminder.modal";
import { connectSocket } from "@/lib/socket";
import {
  getMissedTaskRemindersSlice,
  setReminderList,
} from "@/store/slices/leadTaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import { IReminderData } from "@/models/LeadTaskReminder.model";

const GlobalReminderProvider = () => {
  const dispatch: RootDispatch = useDispatch();

  const reminderList = useSelector(
    (state: RootState) => state.leadTasks.reminderList
  );

  // Show modal if there's at least one reminder
  const showReminderModal = reminderList.length > 0;

  useEffect(() => {
    const socket = connectSocket();

    const handleTaskReminder = (data: IReminderData) => {
      dispatch(setReminderList([...reminderList, data]));
    };

    socket.on("taskReminder", handleTaskReminder);

    return () => {
      socket.off("taskReminder", handleTaskReminder);
    };
  }, [dispatch, reminderList]); // depend on reminderList to always get latest

  useEffect(() => {
    dispatch(getMissedTaskRemindersSlice());
  }, [dispatch]);

  const handleRemoveReminder = (taskId: string) => {
    const updatedList = reminderList.filter(
      (reminder) => reminder.taskId !== taskId
    );
    dispatch(setReminderList(updatedList));
  };

  return (
    <>
      {showReminderModal && (
        <ReminderModal
          isOpen={true}
          onClose={() => handleRemoveReminder(reminderList[0].taskId!)}
          reminderData={reminderList[0]}
          onAction={(action, id) => handleRemoveReminder(id!)}
          onRemoveReminder={handleRemoveReminder}
        />
      )}
    </>
  );
};

export default GlobalReminderProvider;
