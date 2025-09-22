import axiosSetup from "../utils/axiosSetup";
export const createTemplate = async (data: any) => {
  try {
    const response = await axiosSetup.post("/api/templates/create", data);
    return response.data;
  } catch (error) {}
};
