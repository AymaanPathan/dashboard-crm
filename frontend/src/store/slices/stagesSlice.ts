/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllStagesOfOrgApi } from "@/api/stage.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IStage } from "@/models/stage.model";

const initialState = {
  stages: [] as IStage[],
  loading: {
    fetchingStages: false,
  },
  error: "",
};

export const fetchStages = createAsyncThunk(
  "stages/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllStagesOfOrgApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const stagesSlice = createSlice({
  name: "stages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStages.pending, (state) => {
      state.loading.fetchingStages = true;
      state.error = "";
    });
    builder.addCase(fetchStages.fulfilled, (state, action) => {
      state.loading.fetchingStages = false;
      state.stages = action.payload;
    });
    builder.addCase(fetchStages.rejected, (state, action) => {
      state.loading.fetchingStages = false;
      state.error = action.payload as string;
    });
  },
});

export default stagesSlice.reducer;
