/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeadFilters } from "@/models/lead.model";
import axiosSetup from "@/utils/axiosSetup";

export const getKanbanData = async (filters?: LeadFilters) => {
  try {
    const response = await axiosSetup.get("/kanban/getkanban", {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Kanban data:", error);
    throw error.response?.data?.message;
  }
};
