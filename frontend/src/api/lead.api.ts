/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILead } from "@/models/lead.model";
import axiosSetup from "@/utils/axiosSetup";

export const getLeadForKanbanApi = async () => {
  const response = await axiosSetup.get("/lead/getAll");
  return response.data;
};

export const addLeadApi = async (leadData: ILead) => {
  const response = await axiosSetup.post("/lead/add", leadData);
  return response.data;
};

export const addLeadViaExcel = async (
  file: File | undefined,
  assigneeId: string
) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("assigneeId", assigneeId);

  const res = await axiosSetup.post("lead/import", formData);
  return res.data;
};

export const updateLeadDragDropApi = async (
  leadId: string,
  oldStage: string,
  newStage: string,
  oldPosition: number,
  newPosition: number
): Promise<any> => {
  const response = await axiosSetup.patch("/lead/updateStatus", {
    leadId,
    oldStage,
    newStage,
    oldPosition,
    newPosition,
  });

  return response.data;
};

export const updateAssigneeApi = async (
  leadId: string,
  newAssigneeId: string
) => {
  const response = await axiosSetup.patch("/lead/updateAssignee", {
    leadId,
    newAssigneeId,
  });
  return response.data;
};

export const getOneLeadApi = async (leadId: string) => {
  try {
    const response = await axiosSetup.get(`/lead/${leadId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching lead:", error);
    throw error;
  }
};
