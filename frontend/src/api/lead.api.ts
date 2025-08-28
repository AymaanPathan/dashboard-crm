/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "@/utils/axiosSetup";

export const getLeadForKanbanApi = async () => {
  const response = await axiosSetup.get("/lead/getAll");
  return response.data;
};

export const updateLeadDragDropApi = async (
  leadId: string,
  newStatus: string,
  newPosition: number,
  oldStatus: string,
  oldPosition: number
): Promise<any> => {
  const response = await axiosSetup.patch("/lead/updateStatus", {
    leadId,
    oldStatus,
    newStatus,
    oldPosition,
    newPosition,
  });

  return response.data;
};
