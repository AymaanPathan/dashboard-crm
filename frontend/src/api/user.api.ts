/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@/models/user.model";
import axiosSetup from "../utils/axiosSetup";

export const addUserApi = async (userData: IUser) => {
  try {
    const response = await axiosSetup.post("/people/add", userData);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

export const getUsersApi = async () => {
  try {
    const response = await axiosSetup.get("people/all");
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

export const getUserByRoleApi = async () => {
  try {
    const response = await axiosSetup.get("people/getUserByRole");
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

export const getUserManagerApi = async (role: string) => {
  try {
    const response = await axiosSetup.post("people/getAllUserManagers", {
      role,
    });
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};
