import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LeadTask } from "@/models/leadTask.model";
import {
  addLeadTaskApi,
  completeTaskApi,
  getLeadTasksByLeadIdApi,
  getMissedTaskRemindersApi,
  getTodayLeadTasksApi,
  updateTaskReminderStatusApi,
} from "@/api/leadTask.api";
import { IReminderData } from "@/models/LeadTaskReminder.model";

const initialState = {
  todaysTasks: [] as LeadTask[],
  todayTaskCount: 0,
  leadTasks: [] as LeadTask[],
  reminderList: [] as IReminderData[],
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

export const updateTaskReminderStatusSlice = createAsyncThunk(
  "leadTasks/updateReminderStatus",
  async (payload: { taskId: string; status: string }) => {
    const { taskId, status } = payload;
    const response = await updateTaskReminderStatusApi(taskId, status);
    return response;
  }
);

export const getMissedTaskRemindersSlice = createAsyncThunk(
  "leadTasks/getMissedReminders",
  async () => {
    const response = await getMissedTaskRemindersApi();
    return response;
  }
);

export const completeTaskSlice = createAsyncThunk(
  "/leadTasks/getMissedReminders",
  async () => {
    const response = await completeTaskApi();
    return response;
  }
);

const leadTasksSlice = createSlice({
  name: "leadTasks",
  initialState,
  reducers: {
    setReminderList: (state, action) => {
      state.reminderList = action.payload;
    },
  },
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
      })
      .addCase(updateTaskReminderStatusSlice.pending, (state) => {
        state.loading.updatingTask = true;
        state.error = "";
      })
      .addCase(updateTaskReminderStatusSlice.fulfilled, (state, action) => {
        state.loading.updatingTask = false;
        const { taskId, status } = action.payload;
        const task = state.leadTasks.find((t) => t.id === taskId);
        if (task) {
          task.reminderStatus = status;
        }
      })
      .addCase(updateTaskReminderStatusSlice.rejected, (state, action) => {
        state.loading.updatingTask = false;
        state.error = action.payload as string;
      })
      .addCase(getMissedTaskRemindersSlice.pending, (state) => {
        state.loading.addingTask = true;
        state.error = "";
      })
      .addCase(getMissedTaskRemindersSlice.fulfilled, (state, action) => {
        state.loading.addingTask = false;
        console.log("reminder payload:", action.payload);
        state.reminderList = action.payload;
      })
      .addCase(getMissedTaskRemindersSlice.rejected, (state, action) => {
        state.loading.addingTask = false;
        state.error = action.payload as string;
      })
      .addCase(completeTaskSlice.pending, (state) => {
        state.loading.addingTask = true;
        state.error = "";
      })
      .addCase(completeTaskSlice.fulfilled, (state, action) => {
        state.loading.addingTask = false;
        state.leadTasks = state.leadTasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(completeTaskSlice.rejected, (state, action) => {
        state.loading.addingTask = false;
        state.error = action.payload as string;
      });
  },
});

export const { setReminderList } = leadTasksSlice.actions;
export default leadTasksSlice.reducer;
