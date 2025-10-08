/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrganization } from "@/models/org.model";
import axiosSetup from "../utils/axiosSetup";

export const createNewOrgApi = async (orgData: IOrganization) => {
  try {
    const response = await axiosSetup.post("org/create", orgData);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

export const getOrgDataApi = async () => {
  try {
    const response = await axiosSetup.get(`org/info`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
