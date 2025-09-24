import { ICreateQuotationPayload } from "@/models/quotation.model";
import axiosSetup from "../utils/axiosSetup";

export const createQuotationApi = async (data: ICreateQuotationPayload) => {
  try {
    const response = await axiosSetup.post("/quotation/createQuotation", data);
    console.log("Quotation created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw error;
  }
};
