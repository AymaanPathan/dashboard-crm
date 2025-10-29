/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addUserApi,
  getUserByRoleApi,
  getUserManagerApi,
  getUsersApi,
} from "@/api/user.api";
import { IUser } from "@/models/user.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TeamMembers {
  salesReps: IUser[];
  salesManagers: IUser[];
  admins: IUser[];
}

interface UserManagers {
  myManagers: IUser[];
  myRole: string;
}

const initialState = {
  teamMembers: {
    salesReps: [] as IUser[],
    salesManagers: [] as IUser[],
    admins: [] as IUser[],
  } as TeamMembers,
  myManagers: { myManagers: [] as IUser[], myRole: "" } as UserManagers,
  users: [] as IUser[],
  analytics: {
    totalPeople: 0,
    addedThisMonth: 0,
    addedLastMonth: 0,
    difference: 0,
    percentageChange: 0,
    trend: "no change" as "increased" | "decreased" | "no change",
  },
  loading: {
    addingUser: false,
    fetchingUsers: false,
    fetchingByRole: false,
    fetchingManagers: false,
  },
  error: "",
};

export const addUserSlice = createAsyncThunk(
  "user/adduser",
  async (userData: IUser, { rejectWithValue }) => {
    try {
      const response = await addUserApi(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getUserSlice = createAsyncThunk(
  "user/getuser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getUserByRoleSlice = createAsyncThunk(
  "user/getUserByRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserByRoleApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getUserManagerSlice = createAsyncThunk(
  "user/getUserManager",
  async (role: string, { rejectWithValue }) => {
    try {
      const response = await getUserManagerApi(role);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUserSlice.pending, (state) => {
        state.loading.addingUser = true;
      })
      .addCase(addUserSlice.fulfilled, (state, action) => {
        state.loading.addingUser = false;
        state.users.push(action.payload);
      })
      .addCase(addUserSlice.rejected, (state) => {
        state.loading.addingUser = false;
      })
      .addCase(getUserSlice.pending, (state) => {
        state.loading.fetchingUsers = true;
      })
      .addCase(getUserSlice.fulfilled, (state, action) => {
        state.loading.fetchingUsers = false;
        state.users = action.payload.data.people;
        state.analytics = action.payload.data.analytics;
      })
      .addCase(getUserSlice.rejected, (state) => {
        state.loading.fetchingUsers = false;
      })
      .addCase(getUserByRoleSlice.pending, (state) => {
        state.loading.fetchingByRole = true;
      })
      .addCase(getUserByRoleSlice.fulfilled, (state, action) => {
        state.loading.fetchingByRole = false;
        state.teamMembers = action.payload.data;
      })
      .addCase(getUserByRoleSlice.rejected, (state) => {
        state.loading.fetchingByRole = false;
      })
      .addCase(getUserManagerSlice.pending, (state) => {
        state.loading.fetchingManagers = true;
      })
      .addCase(getUserManagerSlice.fulfilled, (state, action) => {
        state.loading.fetchingManagers = false;
        state.myManagers = action.payload;
      })
      .addCase(getUserManagerSlice.rejected, (state) => {
        state.loading.fetchingManagers = false;
      });
  },
});

export default UserSlice.reducer;
