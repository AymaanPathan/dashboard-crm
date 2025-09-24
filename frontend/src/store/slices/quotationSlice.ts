/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { createQuotationApi } from "@/api/quotation.api";

interface QuotationState {
  myQuotations: ICreateQuotationPayload[];
  loading: {
    creatingQuotation: boolean;
  };
  error: string;
}

const initialState: QuotationState = {
  myQuotations: [],
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
        console.log("Created quotation:", action.payload);
        state.myQuotations.push(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading.creatingQuotation = false;
        state.error = action.error.message || "Failed to create quotation";
      });
  },
});

export default quotationSlice.reducer;
