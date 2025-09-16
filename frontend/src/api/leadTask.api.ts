import { LeadTask } from "@/models/leadTask.model";
import axiosSetup from "@/utils/axiosSetup";

export const addLeadTaskApi = async (leadId: string, leadData: LeadTask) => {
  const response = await axiosSetup.post("/leadTask/addTask", {
    leadId,
    taskData: leadData,
  });
  return response.data.data;
};

export const getLeadTasksByLeadIdApi = async (leadId: string) => {
  const response = await axiosSetup.post("/leadTask/getTasks", { leadId });
  return response.data.data;
};

export const getTodayLeadTasksApi = async () => {
  const response = await axiosSetup.get("/leadTask/todayTasks");
  return response.data.data;
};

export const updateTaskReminderStatusApi = async (
  taskId: string,
  status: string
) => {
  const response = await axiosSetup.patch("/leadTask/updateReminderStatus", {
    taskId,
    status,
  });
  return response.data.data;
};

export const getMissedTaskRemindersApi = async () => {
  const response = await axiosSetup.get("/leadTask/missedReminders");
  return response.data.data;
};

export const completeTaskApi = async (taskId: string, status: string) => {
  const response = await axiosSetup.post("leadTask/completeTask", {
    taskId,
    status,
  });
  console.log("completeTaskApi response:", response.data.data);
  return response.data;
};

export const getAllMyTasksApi = async () => {
  const response = await axiosSetup.get("/leadTask/allTasks");
  return response.data.data;
};

export const getIncompleteTasksApi = async () => {
  const response = await axiosSetup.get("/leadTask/incompleteTasks");
  return response.data.data;
}