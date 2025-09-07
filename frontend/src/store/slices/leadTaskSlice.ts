import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LeadTask } from "@/models/leadTask.model";
import { addLeadTaskApi } from "@/api/leadTask.api";

const initialState = {
  leadTasks: [] as LeadTask[],
  loading: false,
  error: "",
};

export const addLeadTaskSlice = createAsyncThunk(
  "leadTasks/add",
  async (leadTask: LeadTask) => {
    const response = await addLeadTaskApi(leadTask);
    return response;
  }
);

const leadTasksSlice = createSlice({
  name: "leadTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addLeadTaskSlice.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(addLeadTaskSlice.fulfilled, (state, action) => {
      state.loading = false;
      state.leadTasks = action.payload;
    });
    builder.addCase(addLeadTaskSlice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default leadTasksSlice.reducer;
