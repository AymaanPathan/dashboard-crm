import axiosSetup from "@/utils/axiosSetup";

export const updateLeadDragDropApi = async (
  leadId: string,
  newStatus: string,
  newPosition: number,
  oldStatus: string,
  oldPosition: number
): Promise<void> => {
  const response = await axiosSetup.patch(`/lead/update/${leadId}`, {
    oldStatus,
    newStatus,
    oldPosition,
    newPosition,
  });
  return response.data;
};
