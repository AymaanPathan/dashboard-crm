/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";

export const handleResendOtpApi = async (email: string) => {
  try {
    const res = await axiosSetup.post("/resendotp", {
      email,
    });

    return res.data;
  } catch (error: any) {
    throw error?.response.data.message;
  }
};
