/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { createQuotationApi } from "@/api/quotation.api";
import { getQuotationsByLeadApi } from "@/api/quotation.api";
interface QuotationState {
  quotations: ICreateQuotationPayload[];
  loading: {
    creatingQuotation: boolean;
    fetchingQuotations: boolean;
  };
  error: string;
}

const initialState: QuotationState = {
  quotations: [],
  loading: {
    creatingQuotation: false,
    fetchingQuotations: false,
  },
  error: "",
};

export const createQuotation = createAsyncThunk(
  "quotations/create",
  async (data: ICreateQuotationPayload, { rejectWithValue }) => {
    try {
      const response = await createQuotationApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getQuotationsByLead = createAsyncThunk(
  "quotations/getByLead",
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await getQuotationsByLeadApi(leadId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
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
        console.log("action", action.payload.quotation);
        state.quotations.unshift(action.payload.quotation);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading.creatingQuotation = false;
        state.error = action.error.message || "Failed to create quotation";
      })
      .addCase(getQuotationsByLead.pending, (state) => {
        state.loading.fetchingQuotations = true;
        state.error = "";
      })
      .addCase(getQuotationsByLead.fulfilled, (state, action) => {
        state.loading.fetchingQuotations = false;
        state.quotations = action.payload;
      })
      .addCase(getQuotationsByLead.rejected, (state, action) => {
        state.loading.fetchingQuotations = false;
        state.error = action.error.message || "Failed to fetch quotations";
      });
  },
});

export default quotationSlice.reducer;
