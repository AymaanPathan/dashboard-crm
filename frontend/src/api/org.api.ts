import { IOrganization } from "@/models/org.model";
import axiosSetup from "../utils/axiosSetup";
import SuccessToast from "@/assets/toast/SuccessToast";

export const createNewOrgApi = async (orgData: IOrganization) => {
  try {
    const response = await axiosSetup.post("org/create", orgData);
    SuccessToast({ title: "Organization setup completed successfully!" });

    return response.data;
  } catch (error) {
    throw error;
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
