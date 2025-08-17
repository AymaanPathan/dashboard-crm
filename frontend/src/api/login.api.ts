/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorToast from "@/assets/toast/ErrorToast";
import axiosSetup from "../utils/axiosSetup";

export const handleLoginApi = async (email: string, password: string) => {
  try {
    const { data } = await axiosSetup.post("/login", {
      email,
      password,
    });
    return { token: data.data, user: data.user };
  } catch (error: any) {
    console.error("Login API error:", error);
    ErrorToast({ title: "Login failed", description: error?.response.data.message });
  }
};
