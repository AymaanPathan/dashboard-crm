/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "@/utils/axiosSetup";

export const getAllStagesOfOrgApi = async () => {
  try {
    const res = await axiosSetup.get("/stages/all");
    return res.data.data;
  } catch (error: any) {
    console.error("Error fetching stages:", error);
    throw error?.response?.data?.message;
  }
};
