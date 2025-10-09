/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LeadTask } from "@/models/leadTask.model";
import {
  addLeadTaskApi,
  completeTaskApi,
  getAllMyTasksApi,
  getIncompleteTasksApi,
  getLeadTasksByLeadIdApi,
  getMissedTaskRemindersApi,
  getTodayLeadTasksApi,
  updateTaskReminderStatusApi,
} from "@/api/leadTask.api";
import { IReminderData } from "@/models/LeadTaskReminder.model";

const initialState = {
  myAllTasks: [] as LeadTask[],
  myIncompleteTasks: [] as LeadTask[],
  myIncompleteTaskCount: 0,
  allTaskCount: 0,
  todaysTasks: [] as LeadTask[],
  todayTaskCount: 0,
  leadTasks: [] as LeadTask[],
  reminderList: [] as IReminderData[],
  loading: {
    getAllMyTasks: false,
    getIncompleteTasks: false,
    getLeadTasksByLeadId: false,
    getTodayLeadTasks: false,
    addLeadTask: false,
    updateTaskReminderStatus: false,
    completeTask: false,
    getMissedReminders: false,
    deleteTask: false,
  },
  error: "",
};

export const addLeadTaskSlice = createAsyncThunk(
  "leadTasks/add",
  async (
    payload: { leadId: string; leadTask: LeadTask },
    { rejectWithValue }
  ) => {
    try {
      const { leadId, leadTask } = payload;
      const response = await addLeadTaskApi(leadId, leadTask);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getLeadTasksByLeadIdSlice = createAsyncThunk(
  "leadTasks/getByLeadId",
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await getLeadTasksByLeadIdApi(leadId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getTodayLeadTasksSlice = createAsyncThunk(
  "leadTasks/getToday",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await getTodayLeadTasksApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateTaskReminderStatusSlice = createAsyncThunk(
  "leadTasks/updateReminderStatus",
  async (payload: { taskId: string; status: string }, { rejectWithValue }) => {
    try {
      const { taskId, status } = payload;
      const response = await updateTaskReminderStatusApi(taskId, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getMissedTaskRemindersSlice = createAsyncThunk(
  "leadTasks/getMissedReminders",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await getMissedTaskRemindersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const completeTaskSlice = createAsyncThunk(
  "/leadTasks/getMissedReminders",
  async (
    { taskId, status }: { taskId: string; status: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const response = await completeTaskApi(taskId, status);
      return { taskId, status, data: response.data };
    } catch (error: any) {
      const state = getState() as { leadTasks: typeof initialState };
      const originalTask = state.leadTasks.leadTasks.find(
        (t) => t.id === taskId
      );
      return rejectWithValue({ taskId, originalTask, error: error.message });
    }
  }
);

export const getAllMyTasksSlice = createAsyncThunk(
  "leadTasks/getAllMyTasks",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await getAllMyTasksApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
export const getIncompleteTasksSlice = createAsyncThunk(
  "leadTasks/getIncompleteTasks",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await getIncompleteTasksApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const leadTasksSlice = createSlice({
  name: "leadTasks",
  initialState,
  reducers: {
    optimisticCompleteTask: (state, action) => {
      const { taskId, status } = action.payload;

      // Update in leadTasks
      const leadTask = state.leadTasks.find((task) => task.id === taskId);
      if (leadTask) {
        leadTask.status = status;
      }

      // Update in myAllTasks
      const myTask = state.myAllTasks.find((task) => task.id === taskId);
      if (myTask) {
        myTask.status = status;
      }

      // Update in todaysTasks
      const todayTask = state.todaysTasks.find((task) => task.id === taskId);
      if (todayTask) {
        todayTask.status = status;
      }

      // Remove from incomplete tasks if completing
      if (status === "completed" || status === "done") {
        state.myIncompleteTasks = state.myIncompleteTasks.filter(
          (task) => task.id !== taskId
        );
        state.myIncompleteTaskCount = Math.max(
          0,
          state.myIncompleteTaskCount - 1
        );
      }
    },
    rollbackTaskUpdate: (state, action) => {
      const { taskId, originalTask } = action.payload;

      if (!originalTask) return;

      // Rollback in leadTasks
      const leadTaskIndex = state.leadTasks.findIndex(
        (task) => task.id === taskId
      );
      if (leadTaskIndex !== -1) {
        state.leadTasks[leadTaskIndex] = { ...originalTask };
      }

      // Rollback in myAllTasks
      const myTaskIndex = state.myAllTasks.findIndex(
        (task) => task.id === taskId
      );
      if (myTaskIndex !== -1) {
        state.myAllTasks[myTaskIndex] = { ...originalTask };
      }

      // Rollback in todaysTasks
      const todayTaskIndex = state.todaysTasks.findIndex(
        (task) => task.id === taskId
      );
      if (todayTaskIndex !== -1) {
        state.todaysTasks[todayTaskIndex] = { ...originalTask };
      }

      // Re-add to incomplete tasks if it was incomplete before
      if (
        originalTask.status !== "completed" &&
        originalTask.status !== "done"
      ) {
        const existsInIncomplete = state.myIncompleteTasks.some(
          (task) => task.id === taskId
        );
        if (!existsInIncomplete) {
          state.myIncompleteTasks.push({ ...originalTask });
          state.myIncompleteTaskCount += 1;
        }
      }
    },

    setReminderList: (state, action) => {
      state.reminderList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addLeadTaskSlice.pending, (state) => {
      state.loading.addLeadTask = true;
      state.error = "";
    });
    builder.addCase(addLeadTaskSlice.fulfilled, (state) => {
      state.loading.addLeadTask = false;
    });
    builder
      .addCase(addLeadTaskSlice.rejected, (state, action) => {
        state.loading.addLeadTask = false;
        state.error = action.payload as string;
      })
      .addCase(getLeadTasksByLeadIdSlice.pending, (state) => {
        state.loading.getLeadTasksByLeadId = true;
        state.error = "";
      })
      .addCase(getLeadTasksByLeadIdSlice.fulfilled, (state, action) => {
        state.loading.getLeadTasksByLeadId = false;
        console.log("Fetched lead tasks:", action.payload);
        state.leadTasks = action.payload;
      })
      .addCase(getLeadTasksByLeadIdSlice.rejected, (state, action) => {
        state.loading.getLeadTasksByLeadId = false;
        state.error = action.payload as string;
      })
      .addCase(getTodayLeadTasksSlice.pending, (state) => {
        state.loading.getTodayLeadTasks = true;
        state.error = "";
      })
      .addCase(getTodayLeadTasksSlice.fulfilled, (state, action) => {
        state.loading.getTodayLeadTasks = false;
        state.todaysTasks = action.payload.tasks;
        state.todayTaskCount = action.payload.count;
      })
      .addCase(getTodayLeadTasksSlice.rejected, (state, action) => {
        state.loading.getTodayLeadTasks = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskReminderStatusSlice.pending, (state) => {
        state.loading.updateTaskReminderStatus = true;
        state.error = "";
      })
      .addCase(updateTaskReminderStatusSlice.fulfilled, (state, action) => {
        state.loading.updateTaskReminderStatus = false;
        const { taskId, status } = action.payload;
        const task = state.leadTasks.find((t) => t.id === taskId);
        if (task) {
          task.reminderStatus = status;
        }
      })
      .addCase(updateTaskReminderStatusSlice.rejected, (state, action) => {
        state.loading.updateTaskReminderStatus = false;
        state.error = action.payload as string;
      })
      .addCase(getMissedTaskRemindersSlice.pending, (state) => {
        state.loading.getMissedReminders = true;
        state.error = "";
      })
      .addCase(getMissedTaskRemindersSlice.fulfilled, (state, action) => {
        state.loading.getMissedReminders = false;

        state.reminderList = action.payload;
      })
      .addCase(getMissedTaskRemindersSlice.rejected, (state, action) => {
        state.loading.getMissedReminders = false;
        state.error = action.payload as string;
      })
      .addCase(completeTaskSlice.pending, (state) => {
        state.loading.completeTask = true;
        state.error = "";
      })
      .addCase(completeTaskSlice.fulfilled, (state, action) => {
        state.loading.completeTask = false;
        state.leadTasks = state.leadTasks.map((task) =>
          task.id === action.payload.data.id ? action.payload.data : task
        );
      })
      .addCase(completeTaskSlice.rejected, (state, action) => {
        state.loading.completeTask = false;
        state.error = action.payload as string;
      })
      .addCase(getAllMyTasksSlice.pending, (state) => {
        state.loading.getAllMyTasks = true;
        state.error = "";
      })
      .addCase(getAllMyTasksSlice.fulfilled, (state, action) => {
        state.loading.getAllMyTasks = false;
        state.myAllTasks = action.payload.tasks;
        state.allTaskCount = action.payload.count;
      })
      .addCase(getAllMyTasksSlice.rejected, (state, action) => {
        state.loading.getAllMyTasks = false;
        state.error = action.payload as string;
      })
      .addCase(getIncompleteTasksSlice.pending, (state) => {
        state.loading.getIncompleteTasks = true;
        state.error = "";
      })
      .addCase(getIncompleteTasksSlice.fulfilled, (state, action) => {
        state.loading.getIncompleteTasks = false;
        state.myIncompleteTasks = action.payload.tasks;
        state.myIncompleteTaskCount = action.payload.count;
      })
      .addCase(getIncompleteTasksSlice.rejected, (state, action) => {
        state.loading.getIncompleteTasks = false;
        state.error = action.payload as string;
      });
  },
});

export const { setReminderList, rollbackTaskUpdate, optimisticCompleteTask } =
  leadTasksSlice.actions;
export default leadTasksSlice.reducer;
