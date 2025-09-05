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
