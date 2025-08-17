/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleLoginApi } from "../../api/login.api";

import { IUser } from "@/models/user.model";
import { handleRegisterApi } from "@/api/register.api";
import { handleVerifyOtpApi } from "@/api/verifyOtp";
import { handleResendOtpApi } from "@/api/resendOtp";

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
      const res = await handleLoginApi(email, password);

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
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const res = action.payload;
        state.loading = false;
        state.token = res?.token;
        state.userName = res?.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleVerifyOtp.fulfilled, (state) => {
        state.loading = false;
        // Optionally handle response data here, e.g.:
        // state.token = action.payload.token;
        // state.userName = action.payload.user;
      })
      .addCase(handleVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleVerifyOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleResendOtp.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle response data here, e.g.:
        // state.token = action.payload.token;
        // state.userName = action.payload.user;
      })
      .addCase(handleResendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleResendOtp.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
