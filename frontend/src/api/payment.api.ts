/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";

export const getAllPaymentsApi = async (
  filter: string = "all",
  page: number = 1,
  limit: number = 10,
  search: string = "",
  transactionPage: number = 1,
  transactionLimit: number = 5
) => {
  try {
    const response = await axiosSetup.get("/payment/all", {
      params: {
        filter,
        page,
        limit,
        search,
        transactionPage,
        transactionLimit,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all payments:", error);
    throw error?.response?.data?.message || "Failed to fetch payments";
  }
};
