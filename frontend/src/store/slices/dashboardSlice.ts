import { getLeadStatsApi, getTaskStatsApi } from "@/api/dashboard.api";
import { LeadStats, TaskStats } from "@/models/lead.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  leadStats: {} as LeadStats,
  taskStats: {} as TaskStats,
  loadingState: {
    getLeadStatsLoading: false,
    getTaskStatsLoading: false,
  },
};

export const getLeadStatus = createAsyncThunk(
  "dashboard/getLeadStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLeadStatsApi();
      return response.data;
    } catch (error: unknown) {
      throw rejectWithValue(error);
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
      throw rejectWithValue(error);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(getTaskStatus.pending, (state) => {
        state.loadingState.getTaskStatsLoading = true;
      })
      .addCase(getTaskStatus.fulfilled, (state, action) => {
        state.loadingState.getTaskStatsLoading = false;
        state.taskStats = action.payload;
      })
      .addCase(getTaskStatus.rejected, (state) => {
        state.loadingState.getTaskStatsLoading = false;
      });
  },
});

export default dashboardSlice.reducer;
