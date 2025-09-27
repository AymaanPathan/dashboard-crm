/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { createQuotationApi } from "@/api/quotation.api";
import { getQuotationsByLeadApi } from "@/api/quotation.api";
interface QuotationState {
  quotations: ICreateQuotationPayload[];
  loading: {
    creatingQuotation: boolean;
  };
  error: string;
}

const initialState: QuotationState = {
  quotations: [],
  loading: {
    creatingQuotation: false,
  },
  error: "",
};

export const createQuotation = createAsyncThunk(
  "quotations/create",
  async (data: ICreateQuotationPayload) => {
    const response = await createQuotationApi(data);
    return response;
  }
);

export const getQuotationsByLead = createAsyncThunk(
  "quotations/getByLead",
  async (leadId: string) => {
    const response = await getQuotationsByLeadApi(leadId);
    return response;
  }
);

const quotationSlice = createSlice({
  name: "quotations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQuotation.pending, (state) => {
        state.loading.creatingQuotation = true;
        state.error = "";
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading.creatingQuotation = false;
        state.quotations.push(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading.creatingQuotation = false;
        state.error = action.error.message || "Failed to create quotation";
      })
      .addCase(getQuotationsByLead.pending, (state) => {
        state.error = "";
      })
      .addCase(getQuotationsByLead.fulfilled, (state, action) => {
        state.quotations = action.payload;
      })
      .addCase(getQuotationsByLead.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch quotations";
      });
  },
});

export default quotationSlice.reducer;
