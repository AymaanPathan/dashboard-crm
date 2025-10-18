import { getLeadStatsApi } from "@/api/dashboard.api";
import { LeadStats } from "@/models/lead.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  leadStats: {} as LeadStats,
  loadingState: {
    getLeadStatsLoading: false,
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
      });
  },
});

export default dashboardSlice.reducer;
