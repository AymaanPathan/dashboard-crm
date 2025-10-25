/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllPaymentsApi,
  getPaymentTransactionsApi,
  approvePaymentTransactionApi,
} from "@/api/payment.api";

// --- State Interface ---
interface PaymentState {
  payments: any[];
  paymentPagination?: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  selectedPaymentTransactions: any[];
  transactionPagination?: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  loading: {
    fetchingAllPayments: boolean;
    fetchingTransactions: boolean;
    addingPayment: boolean;
    confirmingPayment: boolean;
    approvingTransaction: boolean; // ✅ added
  };
  error: string;
  transactionError: string;
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
  selectedPaymentTransactions: [],
  transactionPagination: {
    currentPage: 1,
    limit: 5,
    totalCount: 0,
    totalPages: 0,
  },
  loading: {
    fetchingAllPayments: false,
    fetchingTransactions: false,
    addingPayment: false,
    confirmingPayment: false,
    approvingTransaction: false, // ✅ added
  },
  error: "",
  transactionError: "",
};

// --- Thunks ---

// ✅ Get All Payments
export const getAllPayments = createAsyncThunk(
  "payments/getAll",
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
      const response = await getAllPaymentsApi(filter, page, limit, search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Get Transactions for a selected payment
export const getPaymentTransactions = createAsyncThunk(
  "payments/getTransactions",
  async (
    { paymentId, page = 1 }: { paymentId: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getPaymentTransactionsApi(paymentId, page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Approve a specific payment transaction
export const approvePaymentTransaction = createAsyncThunk(
  "payments/approveTransaction",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await approvePaymentTransactionApi(transactionId);
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
  reducers: {
    clearTransactions(state) {
      state.selectedPaymentTransactions = [];
      state.transactionPagination = {
        currentPage: 1,
        limit: 5,
        totalCount: 0,
        totalPages: 0,
      };
      state.transactionError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Get All Payments ---
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
      })

      // --- Get Payment Transactions ---
      .addCase(getPaymentTransactions.pending, (state) => {
        state.loading.fetchingTransactions = true;
        state.transactionError = "";
      })
      .addCase(getPaymentTransactions.fulfilled, (state, action) => {
        state.loading.fetchingTransactions = false;
        state.selectedPaymentTransactions = action.payload.transactions;
        state.transactionPagination = {
          totalCount: action.payload.pagination.totalCount,
          totalPages: action.payload.pagination.totalPages,
          currentPage: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(getPaymentTransactions.rejected, (state, action) => {
        state.loading.fetchingTransactions = false;
        state.transactionError = action.payload as string;
      })

      // --- Approve Payment Transaction ---
      .addCase(approvePaymentTransaction.pending, (state) => {
        state.loading.approvingTransaction = true;
      })
      .addCase(approvePaymentTransaction.fulfilled, (state, action) => {
        state.loading.approvingTransaction = false;

        const updatedTransaction = action.payload.transaction;
        const updatedPayment = action.payload.payment;

        // ✅ Update the transaction in state
        state.selectedPaymentTransactions =
          state.selectedPaymentTransactions.map((txn) =>
            txn.id === updatedTransaction.id ? updatedTransaction : txn
          );

        // ✅ Update related payment (if present in list)
        state.payments = state.payments.map((pmt) =>
          pmt.id === updatedPayment.id ? updatedPayment : pmt
        );
      })
      .addCase(approvePaymentTransaction.rejected, (state, action) => {
        state.loading.approvingTransaction = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTransactions } = paymentSlice.actions;
export default paymentSlice.reducer;
