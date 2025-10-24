/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPaymentsApi } from "@/api/payment.api";

// --- State Interface ---
interface PaymentState {
  payments: any[];
  paymentPagination?: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  loading: {
    fetchingAllPayments: boolean;
    addingPayment: boolean;
    confirmingPayment: boolean;
  };
  error: string;
}

// --- Initial State ---
const initialState: PaymentState = {
  payments: [],
  paymentPagination: {
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  },
  loading: {
    fetchingAllPayments: false,
    addingPayment: false,
    confirmingPayment: false,
  },
  error: "",
};

// --- Thunks ---

// Get All Payments with optional transaction pagination
export const getAllPayments = createAsyncThunk(
  "payments/getAll",
  async (
    {
      filter = "all",
      page = 1,
      limit = 10,
      search = "",
      transactionPage = 1,
      transactionLimit = 5,
    }: {
      filter?: string;
      page?: number;
      limit?: number;
      search?: string;
      transactionPage?: number;
      transactionLimit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllPaymentsApi(
        filter,
        page,
        limit,
        search,
        transactionPage,
        transactionLimit
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// --- Slice ---
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Payments
      .addCase(getAllPayments.pending, (state) => {
        state.loading.fetchingAllPayments = true;
        state.error = "";
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading.fetchingAllPayments = false;
        state.payments = action.payload.payments;
        state.paymentPagination = {
          totalCount: action.payload.pagination.totalCount,
          totalPages: action.payload.pagination.totalPages,
          currentPage: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading.fetchingAllPayments = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
