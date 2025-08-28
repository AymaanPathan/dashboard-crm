import { updateLeadDragDropApi } from "@/api/lead.api";
import { LeadState } from "@/models/lead.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    moveLeadBetweenStatuses: (
      state,
      action: PayloadAction<{
        leadId: string;
        newStatus: string;
        oldStatus: string;
        oldPosition: number;
        newPosition: number;
      }>
    ) => {
      const { leadId, newStatus, oldStatus, oldPosition, newPosition } =
        action.payload;

      const lead = state.leads[leadId];

      if (!lead) return;

      const oldStatusIndex = state.statuses.findIndex(
        (s) => s.name === oldStatus
      );
      const newStatusIndex = state.statuses.findIndex(
        (s) => s.name === newStatus
      );

      if (oldStatusIndex === -1 || newStatusIndex === -1) return;

      const oldStatusObj = state.statuses[oldStatusIndex];
      const newStatusObj = state.statuses[newStatusIndex];

      oldStatusObj.leadIds = oldStatusObj.leadIds || [];
      newStatusObj.leadIds = newStatusObj.leadIds || [];

      // Remove from old list
      const oldLeadIndex = oldStatusObj.leadIds.indexOf(leadId);
      if (oldLeadIndex !== -1) oldStatusObj.leadIds.splice(oldLeadIndex, 1);

      // Insert in new list at new position
      newStatusObj.leadIds.splice(newPosition, 0, leadId);

      // Update lead status
      state.leads[leadId].status = newStatus;
      state.leads[leadId].position = newPosition;
    },
  },
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
      });
  },
});

export const { moveLeadBetweenStatuses } = leadSlice.actions; // Export the action

export default leadSlice.reducer;
