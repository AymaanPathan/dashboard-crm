/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeadTask } from "@/models/leadTask.model";
import axiosSetup from "@/utils/axiosSetup";

export const addLeadTaskApi = async (leadId: string, leadData: LeadTask) => {
  try {
    const response = await axiosSetup.post("/leadTask/addTask", {
      leadId,
      taskData: leadData,
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const getLeadTasksByLeadIdApi = async (leadId: string) => {
  try {
    const response = await axiosSetup.post("/leadTask/getTasks", { leadId });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const getTodayLeadTasksApi = async () => {
  try {
    const response = await axiosSetup.get("/leadTask/todayTasks");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const updateTaskReminderStatusApi = async (
  taskId: string,
  status: string
) => {
  try {
    const response = await axiosSetup.patch("/leadTask/updateReminderStatus", {
      taskId,
      status,
    });
    console.log("updateTaskReminderStatusApi response:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const getMissedTaskRemindersApi = async () => {
  try {
    const response = await axiosSetup.get("/leadTask/missedReminders");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const completeTaskApi = async (taskId: string, status: string) => {
  try {
    const response = await axiosSetup.post("leadTask/completeTask", {
      taskId,
      status,
    });
    console.log("completeTaskApi response:", response.data.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const getAllMyTasksApi = async () => {
  try {
    const response = await axiosSetup.get("/leadTask/allTasks");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};

export const getIncompleteTasksApi = async () => {
  try {
    const response = await axiosSetup.get("/leadTask/incompleteTasks");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message;
  }
};
