import { LeadFilters } from "@/models/lead.model";
import axiosSetup from "@/utils/axiosSetup";

export const getKanbanData = async (filters?: LeadFilters) => {
  const response = await axiosSetup.get("/kanban/getkanban", {
    params: filters,
  });
  return response.data;
};
