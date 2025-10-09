/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICreateQuotationPayload } from "@/models/quotation.model";
import axiosSetup from "../utils/axiosSetup";

export const createQuotationApi = async (data: ICreateQuotationPayload) => {
  try {
    const response = await axiosSetup.post("/quotation/createQuotation", data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating quotation:", error);
    throw error?.response?.data?.message;
  }
};

export const getQuotationsByLeadApi = async (leadId: string) => {
  try {
    const response = await axiosSetup.post("/quotation/getQuotationsByLead", {
      leadId,
    });
    console.log("Quotations fetched:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching quotations:", error);
    throw error?.response?.data?.message;
  }
};
