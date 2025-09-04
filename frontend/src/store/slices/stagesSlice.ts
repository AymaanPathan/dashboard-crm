import { getAllStagesOfOrgApi } from "@/api/stage.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IStage } from "@/models/stage.model";

const initialState = {
  stages: [] as IStage[],
  loading: false,
  error: "",
};

export const fetchStages = createAsyncThunk("stages/fetchAll", async () => {
  const response = await getAllStagesOfOrgApi();
  return response;
});

const stagesSlice = createSlice({
  name: "stages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStages.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchStages.fulfilled, (state, action) => {
      state.loading = false;
      state.stages = action.payload;
    });
    builder.addCase(fetchStages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default stagesSlice.reducer;
