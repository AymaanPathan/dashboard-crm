import axiosSetup from "@/utils/axiosSetup";

export const getKanbanData = async () => {
  const response = await axiosSetup.get("/kanban/getkanban");
  console.log("response", response);
  return response.data;
};
