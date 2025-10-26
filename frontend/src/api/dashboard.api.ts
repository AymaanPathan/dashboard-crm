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

interface RevenueParams {
  range: "1M" | "6M" | "1Y";
}

export const getRevenueApi = async (params: RevenueParams) => {
  try {
    const response = await axiosSetup.get("/revenue/get", {
      params, // only { range } is required
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Revenue Data:", error);
    throw error.response?.data?.message || error.message;
  }
};
