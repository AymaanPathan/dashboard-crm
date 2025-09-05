/* eslint-disable @typescript-eslint/no-explicit-any */
import { getKanbanData } from "@/api/kanban.api";
import {
  addLeadApi,
  updateAssigneeApi,
  updateLeadDragDropApi,
} from "@/api/lead.api";
import { ILead, KanbanState } from "@/models/lead.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: KanbanState = {
  leads: [],
  statuses: [],
  kanbanData: [],
  loading: {
    fetchingKanban: false,
    addingLead: false,
    updatingLeadStatus: false,
    updatingAssignee: false,
  },
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
  "kanban/updateStatus",
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
      oldPosition,
      newPosition
    );
    return response;
  }
);

export const addLead = createAsyncThunk(
  "leads/addLead",
  async (lead: ILead) => {
    const response = await addLeadApi(lead);
    return response.data;
  }
);

export const updateLeadAssignee = createAsyncThunk(
  "leads/updateAssignee",
  async ({
    leadId,
    newAssigneeId,
  }: {
    leadId: string;
    newAssigneeId: string;
  }) => {
    const response = await updateAssigneeApi(leadId, newAssigneeId);
    return response.data;
  }
);

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    updateLeadAssigneeLocally: (state, action) => {
      const { leadId, newAssigneeId } = action.payload;
      const lead = state.leads.find((lead) => lead.id === leadId);
      if (lead) {
        lead.assignedToId = newAssigneeId;
      }
    },
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
      const { leadId, oldStageId, newStageId, newPosition } = action.payload;

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
        state.loading.fetchingKanban = true;
      })
      .addCase(fetchLeadForKanban.fulfilled, (state, action) => {
        state.loading.fetchingKanban = false;

        state.kanbanData = action.payload.kanbanData;
        state.leads = action.payload.leads;
      })
      .addCase(fetchLeadForKanban.rejected, (state, action) => {
        state.loading.fetchingKanban = false;
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
        state.loading.updatingLeadStatus = true;
      })
      .addCase(addLead.pending, (state) => {
        state.loading.addingLead = true;
      })
      .addCase(addLead.fulfilled, (state, action) => {
        const newLead = action?.payload?.lead;

        // Add to the main leads array
        state.leads.push(newLead);

        // Find the appropriate stage in kanbanData and add the lead there
        const targetStage = state.kanbanData.find(
          (stage) => stage.stageId === newLead.stageId
        );

        if (targetStage) {
          targetStage.leads.push(newLead);
        }

        state.loading.addingLead = false;
      })
      .addCase(addLead.rejected, (state, action) => {
        console.error("Failed to add lead:", action.error);
        state.loading.addingLead = false;
      })
      .addCase(updateLeadAssignee.fulfilled, (state, action) => {
        state.loading.updatingAssignee = false;
        const updatedLead = action.payload;
        const lead = state.leads.find((lead) => lead.id === updatedLead.id);
        if (lead) {
          lead.assignedToId = updatedLead.assignedToId;
        }
      })
      .addCase(updateLeadAssignee.rejected, (state, action) => {
        state.loading.updatingAssignee = false;
        state.error = action.error.message || "Failed to update lead assignee";
      })
      .addCase(updateLeadAssignee.pending, (state) => {
        state.loading.updatingAssignee = true;
      });
  },
});

export const { moveLeadBetweenStatuses, updateLeadAssigneeLocally } =
  kanbanSlice.actions;
export default kanbanSlice.reducer;
