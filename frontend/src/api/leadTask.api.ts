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
