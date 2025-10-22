/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { createQuotationApi, getAllQuotationsApi } from "@/api/quotation.api";
import { getQuotationsByLeadApi } from "@/api/quotation.api";
interface QuotationState {
  quotations: ICreateQuotationPayload[];
  quotationPagination?: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  loading: {
    creatingQuotation: boolean;
    fetchingQuotations: boolean;
    fetchingAllQuotations: boolean;
  };
  error: string;
}

const initialState: QuotationState = {
  quotations: [],
  quotationPagination: {
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  },
  loading: {
    creatingQuotation: false,
    fetchingQuotations: false,
    fetchingAllQuotations: false,
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
export const getAllQuotations = createAsyncThunk(
  "quotations/getAll",
  async (
    {
      filter = "all",
      page = 1,
      limit = 10,
      search = "",
    }: { filter?: string; page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllQuotationsApi(filter, page, limit, search);
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
      })
      .addCase(getAllQuotations.pending, (state) => {
        state.loading.fetchingAllQuotations = true;
        state.error = "";
      })
      .addCase(getAllQuotations.fulfilled, (state, action) => {
        state.loading.fetchingAllQuotations = false;
        state.quotations = action.payload.quotations;
        state.quotationPagination = {
          totalCount: action.payload.pagination.totalCount,
          totalPages: action.payload.pagination.totalPages,
          currentPage: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(getAllQuotations.rejected, (state, action) => {
        state.loading.fetchingAllQuotations = false;
        state.error = action.payload as string;
      });
  },
});

export default quotationSlice.reducer;
