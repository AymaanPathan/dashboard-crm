import { getKanbanData } from "@/api/kanban.api";
import { updateLeadDragDropApi } from "@/api/lead.api";
import { Lead, LeadState } from "@/models/lead.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LeadState = {
  leads: {},
  statuses: [],
  loading: false,
  error: null,
};

export const updateLeadStatus = createAsyncThunk(
  "leads/updateStatus",
  async (payload: {
    leadId: string;
    newStatus: string;
    newPosition: number;
    oldStatus: string;
    oldPosition: number;
  }) => {
    const response = await updateLeadDragDropApi(
      payload.leadId,
      payload.newStatus,
      payload.newPosition,
      payload.oldStatus,
      payload.oldPosition
    );
    return response;
  }
);

export const fetchLeadForKanban = createAsyncThunk(
  "leads/fetchByKanban",
  async () => {
    const response = await getKanbanData();
    return response.data;
  }
);

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(updateLeadStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeadStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update lead status";
      })
      .addCase(fetchLeadForKanban.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeadForKanban.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched Kanban Data:", action.payload);

        const leads: Record<string, Lead> = {};

        state.statuses = action.payload;
        state.leads = leads;
      })
      .addCase(fetchLeadForKanban.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leads";
      });
  },
});

export default leadSlice.reducer;
