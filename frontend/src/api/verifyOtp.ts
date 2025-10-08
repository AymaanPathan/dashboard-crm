/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";

export const handleVerifyOtpApi = async (email: string, otp: string) => {
  try {
    const res = await axiosSetup.post("/verifyotp", {
      email,
      otp,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response.data.message;
  }
};
