import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LeadTask } from "@/models/leadTask.model";
import {
  addLeadTaskApi,
  getLeadTasksByLeadIdApi,
  getTodayLeadTasksApi,
} from "@/api/leadTask.api";

const initialState = {
  todaysTasks: [] as LeadTask[],
  todayTaskCount: 0,
  leadTasks: [] as LeadTask[],
  loading: {
    addingTask: false,
    updatingTask: false,
    deletingTask: false,
  },
  error: "",
};

export const addLeadTaskSlice = createAsyncThunk(
  "leadTasks/add",
  async (payload: { leadId: string; leadTask: LeadTask }) => {
    const { leadId, leadTask } = payload;
    const response = await addLeadTaskApi(leadId, leadTask);
    return response;
  }
);

export const getLeadTasksByLeadIdSlice = createAsyncThunk(
  "leadTasks/getByLeadId",
  async (leadId: string) => {
    const response = await getLeadTasksByLeadIdApi(leadId);
    return response;
  }
);

export const getTodayLeadTasksSlice = createAsyncThunk(
  "leadTasks/getToday",
  async () => {
    const response = await getTodayLeadTasksApi();
    return response;
  }
);

const leadTasksSlice = createSlice({
  name: "leadTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addLeadTaskSlice.pending, (state) => {
      state.loading.addingTask = true;
      state.error = "";
    });
    builder.addCase(addLeadTaskSlice.fulfilled, (state) => {
      state.loading.addingTask = false;
    });
    builder
      .addCase(addLeadTaskSlice.rejected, (state, action) => {
        state.loading.addingTask = false;
        state.error = action.payload as string;
      })
      .addCase(getLeadTasksByLeadIdSlice.pending, (state) => {
        state.loading.addingTask = true;
        state.error = "";
      })
      .addCase(getLeadTasksByLeadIdSlice.fulfilled, (state, action) => {
        state.loading.addingTask = false;

        console.log("Fetched lead tasks:", action.payload);
        state.leadTasks = action.payload;
      })
      .addCase(getLeadTasksByLeadIdSlice.rejected, (state, action) => {
        state.loading.addingTask = false;
        state.error = action.payload as string;
      })
      .addCase(getTodayLeadTasksSlice.pending, (state) => {
        state.loading.addingTask = true;
        state.error = "";
      })
      .addCase(getTodayLeadTasksSlice.fulfilled, (state, action) => {
        state.loading.addingTask = false;
        state.todaysTasks = action.payload.tasks;
        state.todayTaskCount = action.payload.count;
      })
      .addCase(getTodayLeadTasksSlice.rejected, (state, action) => {
        state.loading.addingTask = false;
        state.error = action.payload as string;
      });
  },
});

export default leadTasksSlice.reducer;
