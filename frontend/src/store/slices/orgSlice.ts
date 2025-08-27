/* eslint-disable @typescript-eslint/no-explicit-any */
import { createNewOrgApi, getOrgDataApi } from "@/api/org.api";
import { IOrganization } from "@/models/org.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrganizationState {
  currentOrganization: IOrganization | null;
  organizations: IOrganization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  loading: false,
  error: null,
};

export const createOrganization = createAsyncThunk(
  "org/create",
  async (orgData: IOrganization) => {
    try {
      const response = await createNewOrgApi(orgData);
      return response.data;
    } catch (error: any) {
      return error.response?.data?.message || "Failed to create organization";
    }
  }
);

export const getOrganizationInfo = createAsyncThunk("org/get", async () => {
  try {
    const response = await getOrgDataApi();
    return response.data;
  } catch (error: any) {
    return error.response?.data?.message || "Failed to retrieve organization";
  }
});

const organizationSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },

    // Move lead between statuses (frontend only for now)
    moveLeadBetweenStatuses: (
      state,
      action: PayloadAction<{
        leadId: string;
        fromStatusName: string;
        toStatusName: string;
      }>
    ) => {
      if (!state.currentOrganization?.statuses) return;

      const { leadId, fromStatusName, toStatusName } = action.payload;

      // Find the source and destination statuses
      const fromStatus = state.currentOrganization.statuses.find(
        (status) => status.name === fromStatusName
      );
      const toStatus = state.currentOrganization.statuses.find(
        (status) => status.name === toStatusName
      );

      if (fromStatus && toStatus) {
        // Remove lead from source status
        fromStatus.leadIds =
          fromStatus.leadIds?.filter((id) => id !== leadId) || [];

        // Add lead to destination status
        if (!toStatus.leadIds) {
          toStatus.leadIds = [];
        }
        toStatus.leadIds.push(leadId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createOrganization.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.organizations.push(action.payload);
      }
    );
    builder
      .addCase(
        createOrganization.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(
        getOrganizationInfo.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.currentOrganization = action.payload;
        }
      )
      .addCase(
        getOrganizationInfo.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(getOrganizationInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { clearError, moveLeadBetweenStatuses } =
  organizationSlice.actions;
export default organizationSlice.reducer;
