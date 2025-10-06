/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILead } from "@/models/lead.model";
import axiosSetup from "@/utils/axiosSetup";

export const getLeadForKanbanApi = async () => {
  try {
    const response = await axiosSetup.get("/lead/getAll");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const addLeadApi = async (leadData: ILead) => {
  try {
    const response = await axiosSetup.post("/lead/add", leadData);
    return response.data;
  } catch (error: any) {
    console.log("Error adding leadsasasa:", error.response?.data.message);
    throw error.response?.data.message;
  }
};

export const addLeadViaExcel = async (
  file: File | undefined,
  assigneeId: string
) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("assigneeId", assigneeId);

  try {
    const res = await axiosSetup.post("lead/import", formData);
    return res.data;
  } catch (error: any) {
    console.error("Error importing leads:", error);
    throw error;
  }
};

export const updateLeadDragDropApi = async (
  leadId: string,
  oldStage: string,
  newStage: string,
  oldPosition: number,
  newPosition: number
): Promise<any> => {
  try {
    const response = await axiosSetup.patch("/lead/updateStatus", {
      leadId,
      oldStage,
      newStage,
      oldPosition,
      newPosition,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating lead position:", error);
    throw error;
  }
};

export const updateAssigneeApi = async (
  leadId: string,
  newAssigneeId: string
) => {
  try {
    const response = await axiosSetup.patch("/lead/updateAssignee", {
      leadId,
      newAssigneeId,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating lead assignee:", error);
    throw error;
  }
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

export const getLeadLogsApi = async (leadId: string) => {
  try {
    const response = await axiosSetup.post("/lead/logs", { leadId });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching lead logs:", error);
    throw error;
  }
};

export const addLeadNoteApi = async (leadId: string, note: string) => {
  try {
    const response = await axiosSetup.post("/lead/addNote", { leadId, note });
    return response.data.data;
  } catch (error: any) {
    console.error("Error adding lead note:", error);
    throw error;
  }
};

export const getLeadNotesApi = async (leadId: string) => {
  try {
    const response = await axiosSetup.post("/lead/getNotes", { leadId });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching lead notes:", error);
    throw error;
  }
};
