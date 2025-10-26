import {
  getLeadStatsApi,
  getRevenueApi,
  getTaskStatsApi,
} from "@/api/dashboard.api";
import { LeadStats, TaskStats } from "@/models/lead.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface RevenueChartData {
  label: string;
  value: number;
}

interface RevenueData {
  chartData: RevenueChartData[];
  totalRevenue: number;
  range: "1M" | "6M" | "1Y";
}

const initialState = {
  leadStats: {} as LeadStats,
  taskStats: {} as TaskStats,
  revenueData: {} as RevenueData,
  loadingState: {
    getLeadStatsLoading: false,
    getTaskStatsLoading: false,
    getRevenueLoading: false,
  },
};

// --- Thunks ---
export const getLeadStatus = createAsyncThunk(
  "dashboard/getLeadStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLeadStatsApi();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const getTaskStatus = createAsyncThunk(
  "dashboard/getTaskStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTaskStatsApi();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

interface RevenueParams {
  range: "1M" | "6M" | "1Y";
}

export const getRevenueStatus = createAsyncThunk(
  "dashboard/getRevenueStatus",
  async (params: RevenueParams, { rejectWithValue }) => {
    try {
      const response = await getRevenueApi(params);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

// --- Slice ---
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lead Stats
      .addCase(getLeadStatus.pending, (state) => {
        state.loadingState.getLeadStatsLoading = true;
      })
      .addCase(getLeadStatus.fulfilled, (state, action) => {
        state.loadingState.getLeadStatsLoading = false;
        state.leadStats = action.payload;
      })
      .addCase(getLeadStatus.rejected, (state) => {
        state.loadingState.getLeadStatsLoading = false;
      })

      // Task Stats
      .addCase(getTaskStatus.pending, (state) => {
        state.loadingState.getTaskStatsLoading = true;
      })
      .addCase(getTaskStatus.fulfilled, (state, action) => {
        state.loadingState.getTaskStatsLoading = false;
        state.taskStats = action.payload;
      })
      .addCase(getTaskStatus.rejected, (state) => {
        state.loadingState.getTaskStatsLoading = false;
      })

      // Revenue Data
      .addCase(getRevenueStatus.pending, (state) => {
        state.loadingState.getRevenueLoading = true;
      })
      .addCase(getRevenueStatus.fulfilled, (state, action) => {
        state.loadingState.getRevenueLoading = false;
        state.revenueData = action.payload;
      })
      .addCase(getRevenueStatus.rejected, (state) => {
        state.loadingState.getRevenueLoading = false;
      });
  },
});

export default dashboardSlice.reducer;
