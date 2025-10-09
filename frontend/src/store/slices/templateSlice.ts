/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateTemplatePayload } from "@/models/template.model";
import { createTemplateApi } from "@/api/template.api";

const initialState = {
  myTemplates: [] as ICreateTemplatePayload[],
  loading: {
    gettingTemplates: false,
    creatingTemplate: false,
  },
  error: "",
};

export const createTemplate = createAsyncThunk(
  "templates/create",
  async (data: ICreateTemplatePayload, { rejectWithValue }) => {
    try {
      const response = await createTemplateApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading.creatingTemplate = false;
        state.error = action.payload as string;
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading.creatingTemplate = true;
        state.error = "";
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading.creatingTemplate = false;
        state.myTemplates.push(action.payload);
      });
  },
});

export default templateSlice.reducer;
