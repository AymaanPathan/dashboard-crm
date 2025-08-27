/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateLeadDragDropApi } from "@/api/lead.api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Lead {
  id: string;
  company?: string;
  location?: string;
  assignee?: string;
  statusName: string;
  // Add other lead properties as needed
}

interface LeadState {
  leads: Record<string, Lead>;
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: {},
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
    // Move lead to different status
    moveLeadToStatus: (
      state,
      action: PayloadAction<{ leadId: string; newStatusName: string }>
    ) => {
      const { leadId, newStatusName } = action.payload;
      if (state.leads[leadId]) {
        state.leads[leadId].statusName = newStatusName;
      }
    },

    // Add a new lead
    addLead: (state, action: PayloadAction<Lead>) => {
      state.leads[action.payload.id] = action.payload;
    },

    // Update lead
    updateLead: (
      state,
      action: PayloadAction<Partial<Lead> & { id: string }>
    ) => {
      const { id, ...updates } = action.payload;
      if (state.leads[id]) {
        state.leads[id] = { ...state.leads[id], ...updates };
      }
    },

    // Remove lead
    removeLead: (state, action: PayloadAction<string>) => {
      delete state.leads[action.payload];
    },

    // Set multiple leads
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload.reduce((acc, lead) => {
        acc[lead.id] = lead;
        return acc;
      }, {} as Record<string, Lead>);
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
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

export const {
  moveLeadToStatus,
  addLead,
  updateLead,
  removeLead,
  setLeads,
  clearError,
  setLoading,
  setError,
} = leadSlice.actions;

export default leadSlice.reducer;
