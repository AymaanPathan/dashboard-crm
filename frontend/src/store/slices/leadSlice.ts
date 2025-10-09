/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addLeadNoteApi,
  getLeadLogsApi,
  getLeadNotesApi,
} from "@/api/lead.api";
import { ILead, ILeadLogs, ILeadNotes } from "@/models/lead.model";
import { getOneLeadApi } from "@/api/lead.api";

const initialState = {
  lead: {} as ILead,
  leadNotes: [] as ILeadNotes[],
  leadLogs: [] as ILeadLogs[],
  loadingState: {
    addingLeadNoteLoading: false,
    getOneLeadLoading: false,
    getLeadLogsLoading: false,
  },

  error: "",
};

export const getOneLeadbyId = createAsyncThunk(
  "lead/getOne",
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await getOneLeadApi(leadId);
      return response;
    } catch (error: any) {
      throw rejectWithValue(error);
    }
  }
);

export const getLeadLogs = createAsyncThunk(
  "lead/getLogs",
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await getLeadLogsApi(leadId);
      return response;
    } catch (error: any) {
      throw rejectWithValue(error);
    }
  }
);

export const addLeadNote = createAsyncThunk(
  "lead/addNote",
  async (noteData: { leadId: string; note: string }, { rejectWithValue }) => {
    try {
      const response = await addLeadNoteApi(noteData.leadId, noteData.note);
      return response;
    } catch (error: any) {
      throw rejectWithValue(error);
    }
  }
);

export const getLeadNotes = createAsyncThunk(
  "lead/getNotes",
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await getLeadNotesApi(leadId);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneLeadbyId.pending, (state) => {
      state.loadingState.getOneLeadLoading = true;
      state.error = "";
    });
    builder.addCase(getOneLeadbyId.fulfilled, (state, action) => {
      state.loadingState.getOneLeadLoading = false;
      state.lead = action.payload;
    });
    builder
      .addCase(getOneLeadbyId.rejected, (state, action) => {
        state.loadingState.getOneLeadLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getLeadLogs.pending, (state) => {
        state.loadingState.getLeadLogsLoading = true;
        state.error = "";
      })
      .addCase(getLeadLogs.fulfilled, (state, action) => {
        state.loadingState.getLeadLogsLoading = false;
        state.leadLogs = action.payload;
      })
      .addCase(getLeadLogs.rejected, (state, action) => {
        state.loadingState.getLeadLogsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addLeadNote.pending, (state) => {
        state.error = "";
        state.loadingState.addingLeadNoteLoading = true;
      })
      .addCase(addLeadNote.fulfilled, (state, action) => {
        state.loadingState.addingLeadNoteLoading = false;
        state.leadNotes.unshift(action.payload);
      })
      .addCase(addLeadNote.rejected, (state, action) => {
        state.loadingState.addingLeadNoteLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getLeadNotes.pending, (state) => {
        state.error = "";
      })
      .addCase(getLeadNotes.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.leadNotes = action.payload;
      })
      .addCase(getLeadNotes.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default leadSlice.reducer;
