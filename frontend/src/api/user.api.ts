import { IUser } from "@/models/user.model";
import axiosSetup from "../utils/axiosSetup";

export const addUserApi = async (userData: IUser) => {
  const response = await axiosSetup.post("/people/add", userData);
  return response.data;
};

export const getUsersApi = async () => {
  const response = await axiosSetup.get("people/all");
  return response.data;
};

export const getUserByRoleApi = async () => {
  const response = await axiosSetup.get("people/getUserByRole");
  return response.data;
};
