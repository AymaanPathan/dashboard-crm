/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "@/utils/axiosSetup";

export const getLeadStatsApi = async () => {
  try {
    const response = await axiosSetup.get("/dashboard/getLeadStats");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Lead Stats:", error);
    throw error.response?.data?.message;
  }
};

export const getTaskStatsApi = async () => {
  try {
    const response = await axiosSetup.get("/dashboard/getTaskStats");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Task Stats:", error);
    throw error.response?.data?.message;
  }
};

export const getRevenueApi = async (range: string) => {
  try {
    const response = await axiosSetup.get("/revenue/get", {
      params: { range },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching Revenue Data:", error);
    throw error.response?.data?.message || error.message;
  }
};
