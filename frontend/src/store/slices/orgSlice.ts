/* eslint-disable @typescript-eslint/no-explicit-any */
import { createNewOrgApi, getOrgDataApi } from "@/api/org.api";
import { IOrganization } from "@/models/org.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrganizationState {
  currentOrganization: IOrganization | null;
  organizations: IOrganization[];
  loading: {
    creating: boolean;
    fetching: boolean;
  };
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  loading: {
    creating: false,
    fetching: false,
  },
  error: null,
};

export const createOrganization = createAsyncThunk(
  "org/create",
  async (orgData: IOrganization, { rejectWithValue }) => {
    try {
      const response = await createNewOrgApi(orgData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getOrganizationInfo = createAsyncThunk(
  "org/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrgDataApi();
      console.log("Get Org Response in Thunk:", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

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
      state.loading.creating = true;
      state.error = null;
    });
    builder.addCase(
      createOrganization.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading.creating = false;
        state.organizations.push(action.payload);
      }
    );
    builder
      .addCase(
        createOrganization.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading.creating = false;
          state.error = action.payload;
        }
      )
      .addCase(
        getOrganizationInfo.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log("Get Org Action Payload:", action.payload);
          state.loading.fetching = false;
          state.currentOrganization = action.payload;
        }
      )
      .addCase(
        getOrganizationInfo.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading.fetching = false;
          state.error = action.payload;
        }
      )
      .addCase(getOrganizationInfo.pending, (state) => {
        state.loading.fetching = true;
        state.error = null;
      });
  },
});

export const { clearError } = organizationSlice.actions;
export default organizationSlice.reducer;
