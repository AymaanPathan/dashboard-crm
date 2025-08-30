import { addUserApi } from "@/api/user.api";
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

export const addUser = createAsyncThunk("user/addUser", async (user: IUser) => {
  const response = await addUserApi(user);
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.users.push(action.payload);
    },
    clearUser: (state) => {
      state.users = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading.isAdding = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading.isAdding = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading.isAdding = false;
        state.error = action.error.message || "";
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
