/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";

export const handleLoginApi = async (email: string, password: string) => {
  try {
    const res = await axiosSetup.post("/login", {
      email,
      password,
    });

    return res.data;
  } catch (error: any) {
    console.error("Login API error:", error);
    throw error;
  }
};
