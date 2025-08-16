import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleLoginApi } from "../../api/login.api";

import { IUser } from "@/models/user.model";
import { handleRegisterApi } from "@/api/register.api";

interface AuthState {
  // user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  userId: string;
  userName: IUser | null;
  mobileNumber: string;
  manager: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  userId: "",
  userName: null,
  mobileNumber: "",
  manager: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { token, user } = await handleLoginApi(email, password);

      return { token, user };
    } catch (error: unknown) {
      return rejectWithValue("Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await handleRegisterApi(username, email, password);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: IUser }>) => {
          const { token, user } = action.payload;
          state.loading = false;
          state.token = token;
          state.userName = user;
        }
      )
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: IUser }>) => {
          const { token, user } = action.payload;
          state.loading = false;
          state.token = token;
          state.userName = user;
        }
      )
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
