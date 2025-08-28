/* eslint-disable @typescript-eslint/no-explicit-any */
import { getKanbanData } from "@/api/kanban.api";
import { updateLeadDragDropApi } from "@/api/lead.api";
import { Lead, LeadState } from "@/models/lead.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LeadState = {
  leads: [],
  statuses: [],
  kanbanData: [],
  loading: false,
  error: null,
};

export const fetchLeadForKanban = createAsyncThunk(
  "leads/fetchByKanban",
  async () => {
    const response = await getKanbanData();
    return response.data;
  }
);

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
    return response;
  }
);

const kanbanSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    moveLeadBetweenStatuses: (
      state,
      action: PayloadAction<{
        leadId: string;
        oldStageId: string;
        newStageId: string;
        oldPosition: number;
        newPosition: number;
      }>
    ) => {
      const { leadId, oldStageId, newStageId, oldPosition, newPosition } =
        action.payload;

      const oldColumn = state.kanbanData.find((c) => c.stageId === oldStageId);
      const newColumn = state.kanbanData.find((c) => c.stageId === newStageId);

      if (!oldColumn || !newColumn) return;

      // Find the lead object in old column
      const leadIndex = oldColumn.leads.findIndex(
        (lead: any) => lead.id === leadId
      );
      if (leadIndex === -1) return; // lead not found in old column

      const [lead] = oldColumn.leads.splice(leadIndex, 1); // remove from old

      // Insert into new column at new position
      if (!newColumn.leads.find((l: any) => l.id === leadId)) {
        newColumn.leads.splice(newPosition, 0, lead);
      }

      // Update positions in old column
      oldColumn.leads.forEach((l: any, idx: number) => {
        l.position = idx;
      });

      // Update positions in new column and stageId
      newColumn.leads.forEach((l: any, idx: number) => {
        l.position = idx;
        l.stageId = newStageId;
      });

      // Also update in main leads array
      const mainLead = state.leads.find((l) => l.id === leadId);
      if (mainLead) {
        mainLead.stageId = newStageId;
        mainLead.position = newPosition;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadForKanban.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeadForKanban.fulfilled, (state, action) => {
        state.loading = false;

        state.kanbanData = action.payload.kanbanData;
        state.leads = action.payload.leads;
      })
      .addCase(fetchLeadForKanban.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leads";
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const { leadId, newStage, newPosition } = action.payload;
        const lead = state.leads.find((l) => l.id === leadId);
        if (lead) {
          lead.stage = newStage;
          lead.position = newPosition;
        }
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update lead status";
      })
      .addCase(updateLeadStatus.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { moveLeadBetweenStatuses } = kanbanSlice.actions;
export default kanbanSlice.reducer;
