import { IUser } from "@/models/user.model";
import axiosSetup from "../utils/axiosSetup";

export const addUserApi = async (userData: IUser) => {
  try {
    const response = await axiosSetup.post("/api/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};
