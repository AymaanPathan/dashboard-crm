/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorToast from "@/assets/toast/ErrorToast";
import axiosSetup from "../utils/axiosSetup";
import SuccessToast from "@/assets/toast/SuccessToast";

export const handleVerifyOtpApi = async (email: string, otp: string) => {
  try {
    const res = await axiosSetup.post("/verifyotp", {
      email,
      otp,
    });
    SuccessToast({
      title: "Registration successful",
      description: "Your email has been verified successfully.",
    });
    return res;
  } catch (error: any) {
    ErrorToast({
      title: "Verification failed",
      description: error?.response.data.message,
    });
  }
};
