/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";
import { ICreateTemplatePayload } from "@/models/template.model";

export const createTemplateApi = async (data: ICreateTemplatePayload) => {
  try {
    const response = await axiosSetup.post(
      "/template/createCompanyTemplate",
      data
    );
    console.log("Created template:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating template:", error);
    throw error?.response?.data?.message;
  }
};
