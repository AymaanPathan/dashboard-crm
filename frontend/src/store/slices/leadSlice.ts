/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
