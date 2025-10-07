/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";

export const handleRegisterApi = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await axiosSetup.post("/register", {
      username,
      email,
      password,
    });

    return res.data;
  } catch (error: any) {
    console.error("Registration API error:", error?.response?.dataz);
    throw error?.response?.data.message;
  }
};
