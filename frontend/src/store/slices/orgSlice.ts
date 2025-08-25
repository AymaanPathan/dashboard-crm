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

export const { clearError } = organizationSlice.actions;
export default organizationSlice.reducer;
