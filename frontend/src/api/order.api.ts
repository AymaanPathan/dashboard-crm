/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "@/utils/axiosSetup";

export const getAllOrdersApi = async (
  filter: string = "all",
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  try {
    const response = await axiosSetup.get("/order/getAllOrders", {
      params: { filter, page, limit, search },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all orders:", error);
    throw error?.response?.data?.message || "Failed to fetch orders";
  }
};
