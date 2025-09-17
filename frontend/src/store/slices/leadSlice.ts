import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLeadLogsApi } from "@/api/lead.api";
import { ILead } from "@/models/lead.model";
import { getOneLeadApi } from "@/api/lead.api";

const initialState = {
  lead: {} as ILead,
  leadLogs: [] as any[],
  loadingState: {
    getOneLeadLoading: false,
    getLeadLogsLoading: false,
  },

  error: "",
};

export const getOneLeadbyId = createAsyncThunk(
  "lead/getOne",
  async (leadId: string) => {
    const response = await getOneLeadApi(leadId);
    return response;
  }
);

export const getLeadLogs = createAsyncThunk(
  "lead/getLogs",
  async (leadId: string) => {
    const response = await getLeadLogsApi(leadId);
    return response;
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
      });
  },
});

export default leadSlice.reducer;
