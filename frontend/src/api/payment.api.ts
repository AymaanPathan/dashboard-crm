/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosSetup from "../utils/axiosSetup";
export const getAllPaymentsApi = async (
  filter: string = "all",
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  try {
    const response = await axiosSetup.get("/payment/all", {
      params: { filter, page, limit, search },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all payments:", error);
    throw error?.response?.data?.message || "Failed to fetch payments";
  }
};
export const getPaymentTransactionsApi = async (
  paymentId: string,
  page: number = 1,
) => {
  try {
    const response = await axiosSetup.get(
      `/payment/${paymentId}/transactions`,
      {
        params: { page },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error fetching transactions for payment ${paymentId}:`,
      error
    );
    throw error?.response?.data?.message || "Failed to fetch transactions";
  }
};
