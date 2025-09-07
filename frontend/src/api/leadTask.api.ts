import { LeadTask } from "@/models/leadTask.model";
import axiosSetup from "@/utils/axiosSetup";

export const addLeadTaskApi = async (leadData: LeadTask) => {
  const response = await axiosSetup.post("/leadTask/addTask", leadData);
  return response.data;
};
