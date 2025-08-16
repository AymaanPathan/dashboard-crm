import axiosSetup from "../utils/axiosSetup";

export const handleVerifyOtpApi = async (email: string, otp: string) => {
  const res = await axiosSetup.post("/verifyotp", {
    email,
    otp,
  });
  return res;
};
