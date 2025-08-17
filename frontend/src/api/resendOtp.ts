/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorToast from "@/assets/toast/ErrorToast";
import axiosSetup from "../utils/axiosSetup";
import SuccessToast from "@/assets/toast/SuccessToast";

export const handleResendOtpApi = async (email: string) => {
  try {
    const res = await axiosSetup.post("/resendotp", {
      email,
    });
    SuccessToast({
      title: "OTP Resent Successfully",
      description: "A new OTP has been sent to your email.",
    });
    return res.data;
  } catch (error: any) {
    ErrorToast({
      title: "Resend OTP failed",
      description: error?.response.data.message,
    });
  }
};
