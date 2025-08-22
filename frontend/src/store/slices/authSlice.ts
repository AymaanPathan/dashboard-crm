/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleLoginApi } from "../../api/login.api";

import { IUser } from "@/models/user.model";
import { handleRegisterApi } from "@/api/register.api";
import { handleVerifyOtpApi } from "@/api/verifyOtp";
import { handleResendOtpApi } from "@/api/resendOtp";
import { setToken } from "@/utils/auth.utils";

interface AuthState {
  // user: any;
  token: string | null;
  loadingState: {
    login: boolean;
    register: boolean;
    verifyOtp: boolean;
    resendOtp: boolean;
  };
  error: string | null;
  userId: string;
  userName: IUser | null;
  mobileNumber: string;
  manager: string | null;
}

const initialState: AuthState = {
  token: null,
  loadingState: {
    login: false,
    register: false,
    verifyOtp: false,
    resendOtp: false,
  },
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
      const res = await handleLoginApi(email, password);
      const token = res.data.data.token;
      const user = res.data.data.user;

      setToken(token, user);
      return res;
    } catch (error: any) {
      console.log("err", error);
      return rejectWithValue(error.response.data.message || "Login failed");
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
    const token = response.data.token;
    const user = response.data.user;
    setToken(token, user);
    return response;
  }
);
export const handleVerifyOtp = createAsyncThunk(
  "auth/handleVerifyOtp",
  async ({ email, otp }: { email: string; otp: string }) => {
    const response = await handleVerifyOtpApi(email, otp);
    return response;
  }
);

export const handleResendOtp = createAsyncThunk(
  "auth/handleResendOtp",
  async ({ email }: { email: string }) => {
    const response = await handleResendOtpApi(email);
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
        state.loadingState.login = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload.data.data.token;
        const username = action.payload.data.data.user.username;

        state.loadingState.login = false;
        state.token = token;
        state.userName = username;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loadingState.login = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loadingState.register = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loadingState.register = false;
        const token = action.payload.data.token;
        const username = action.payload.data.user.username;
        state.token = token;
        state.userName = username;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loadingState.register = false;
      })
      .addCase(handleVerifyOtp.fulfilled, (state) => {
        state.loadingState.verifyOtp = false;

        // Optionally handle response data here, e.g.:
        // state.token = action.payload.token;
        // state.userName = action.payload.user;
      })
      .addCase(handleVerifyOtp.pending, (state) => {
        state.loadingState.verifyOtp = true;
        state.error = null;
      })
      .addCase(handleVerifyOtp.rejected, (state) => {
        state.loadingState.verifyOtp = false;
      })
      .addCase(handleResendOtp.fulfilled, (state, action) => {
        state.loadingState.resendOtp = false;
        // Optionally handle response data here, e.g.:
        // state.token = action.payload.token;
        // state.userName = action.payload.user;
      })
      .addCase(handleResendOtp.pending, (state) => {
        state.loadingState.resendOtp = true;
        state.error = null;
      })
      .addCase(handleResendOtp.rejected, (state) => {
        state.loadingState.resendOtp = false;
      });
  },
});

export default authSlice.reducer;
