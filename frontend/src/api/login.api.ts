/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorToast from "@/assets/toast/ErrorToast";
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
    ErrorToast({
      title: "Login failed",
      description: error?.response.data.message,
    });
    throw error;
  }
};
