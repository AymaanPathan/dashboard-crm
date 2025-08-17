/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorToast from "@/assets/toast/ErrorToast";
import axiosSetup from "../utils/axiosSetup";
import SuccessToast from "@/assets/toast/SuccessToast";

export const handleRegisterApi = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const { data } = await axiosSetup.post("/register", {
      username,
      email,
      password,
    });
    SuccessToast({
      title: "Account Created Successfully",
      description: "An OTP has been sent to your email for verification.",
    });

    return { token: data.data, user: data.user };
  } catch (error: any) {
    console.error("Register API error:", error);
    ErrorToast({
      title: "Registration failed",
      description: error?.response.data.message,
    });
  }
};
