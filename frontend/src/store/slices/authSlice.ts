import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleLoginApi } from "../../api/login.api";
import {
  getToken,
  getRole,
  setToken,
  getUserId,
  getUser,
  getMobileNumber,
} from "../../utils/auth";
import { IUser } from "@/models/user.model";

interface AuthState {
  // user: any;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  userId: string;
  userName: IUser | null;
  mobileNumber: string;
  manager: string | null;
}

const initialState: AuthState = {
  token: getToken() || null,
  role: getRole() || null,
  loading: false,
  error: null,
  userId: getUserId() || "",
  userName: getUser(),
  mobileNumber: getMobileNumber() || "",
  manager: getUser()?.manager ?? null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { token, role, user } = await handleLoginApi(email, password);

      return { token, role, user };
    } catch (error: unknown) {
      return rejectWithValue("Login failed");
    }
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
        (
          state,
          action: PayloadAction<{ token: string; role: string; user: IUser }>
        ) => {
          const { token, role, user } = action.payload;
          setToken(token, role, user);
          state.loading = false;
          state.token = token;
          state.role = role;
          state.userId = user._id || "";
          state.userName = user;
        }
      )
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
