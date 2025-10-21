/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { confirmOrderApi, getAllOrdersApi } from "@/api/order.api";

interface OrderState {
  orders: any[];
  orderPagination?: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  loading: {
    fetchingOrders: boolean;
    fetchingAllOrders: boolean;
    confirmingOrder: boolean;
  };
  error: string;
}

const initialState: OrderState = {
  orders: [],
  orderPagination: {
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  },
  loading: {
    fetchingOrders: false,
    fetchingAllOrders: false,
    confirmingOrder: false,
  },
  error: "",
};

// --- Thunks ---

// Get All Orders
export const getAllOrders = createAsyncThunk(
  "orders/getAll",
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
      const response = await getAllOrdersApi(filter, page, limit, search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Confirm Order
export const confirmOrder = createAsyncThunk(
  "orders/confirm",
  async (quotationId: string, { rejectWithValue }) => {
    try {
      const response = await confirmOrderApi(quotationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// --- Slice ---
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading.fetchingAllOrders = true;
        state.error = "";
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading.fetchingAllOrders = false;
        state.orders = action.payload.orders;
        state.orderPagination = {
          totalCount: action.payload.pagination.totalCount,
          totalPages: action.payload.pagination.totalPages,
          currentPage: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading.fetchingAllOrders = false;
        state.error = action.payload as string;
      })
      .addCase(confirmOrder.pending, (state) => {
        state.loading.confirmingOrder = true;
        state.error = "";
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.loading.confirmingOrder = false;
        state.orders.unshift(action.payload);
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.loading.confirmingOrder = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
