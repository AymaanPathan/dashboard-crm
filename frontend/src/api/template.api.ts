import axiosSetup from "../utils/axiosSetup";
import { ITemplate } from "@/models/template.model";

export const createTemplateApi = async (data: ITemplate) => {
  try {
    const response = await axiosSetup.post("/api/templates/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
