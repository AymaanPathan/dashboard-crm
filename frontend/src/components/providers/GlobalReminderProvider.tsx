"use client";

import { useEffect } from "react";
import ReminderModal from "../modals/reminder.modal";
import { connectSocket } from "@/lib/socket";
import { getTaskRemindersSlice } from "@/store/slices/leadTaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";

const GlobalReminderProvider = () => {
  const dispatch: RootDispatch = useDispatch();

  const reminderList = useSelector(
    (state: RootState) => state.leadTasks.reminderList
  );
  console.log("🔔 GlobalReminderProvider rendered", reminderList);

  // Show modal if there's at least one reminder
  const showReminderModal = reminderList.length > 0;

  useEffect(() => {
    const socket = connectSocket();

    const handleTaskReminder = async () => {
      await dispatch(getTaskRemindersSlice());
    };

    socket.on("taskReminder", handleTaskReminder);

    return () => {
      socket.off("taskReminder", handleTaskReminder);
    };
  }, [dispatch, reminderList]);

  useEffect(() => {
    dispatch(getTaskRemindersSlice());
  }, [dispatch]);

  return <>{showReminderModal && <ReminderModal isOpen={true} />}</>;
};

export default GlobalReminderProvider;
