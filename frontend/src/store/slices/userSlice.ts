import { addUserApi, getUsersApi } from "@/api/user.api";
import { IUser } from "@/models/user.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [] as IUser[],
  loading: {
    isAdding: false,
    isFetching: false,
  },
  error: "",
};

export const addUserSlice = createAsyncThunk(
  "user/adduser",
  async (userData: IUser) => {
    const response = await addUserApi(userData);
    return response;
  }
);

export const getUserSlice = createAsyncThunk("user/getuser", async () => {
  const response = await getUsersApi();
  return response;
});

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUserSlice.pending, (state) => {
        state.loading.isAdding = true;
      })
      .addCase(addUserSlice.fulfilled, (state, action) => {
        state.loading.isAdding = false;
        state.users.push(action.payload);
      })
      .addCase(addUserSlice.rejected, (state) => {
        state.loading.isAdding = false;
      })
      .addCase(getUserSlice.pending, (state) => {
        state.loading.isFetching = true;
      })
      .addCase(getUserSlice.fulfilled, (state, action) => {
        state.loading.isFetching = false;
        state.users = action.payload.data;
      })
      .addCase(getUserSlice.rejected, (state) => {
        state.loading.isFetching = false;
      });
  },
});

export default UserSlice.reducer;
