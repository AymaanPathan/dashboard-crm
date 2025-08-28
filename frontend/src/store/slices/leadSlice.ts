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
  async ({
    leadId,
    oldStage,
    newStage,
    newPosition,
    oldPosition,
  }: {
    leadId: string;
    oldStage: string;
    newStage: string;
    oldPosition: number;
    newPosition: number;
  }) => {
    const response = await updateLeadDragDropApi(
      leadId,
      oldStage,
      newStage,
      newPosition,
      oldPosition
    );
    return response; // Can be void or updated lead if backend returns it
  }
);

// Slice
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
      const { leadId, newStatus, oldStatus, newPosition } = action.payload;

      const lead = state.leads[leadId];
      if (!lead) return;

      const oldColumn = state.statuses.find((s) => s.name === oldStatus);
      const newColumn = state.statuses.find((s) => s.name === newStatus);
      if (!oldColumn || !newColumn) return;

      // Remove lead from old column
      oldColumn.leadIds = oldColumn?.leadIds?.filter((id) => id !== leadId);

      // Add to new column at new position
      newColumn?.leadIds?.splice(newPosition, 0, leadId);

      // Update lead data
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
        // no-op if optimistic update already done
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update lead status";
      });
  },
});

export const { moveLeadBetweenStatuses } = leadSlice.actions;
export default leadSlice.reducer;
