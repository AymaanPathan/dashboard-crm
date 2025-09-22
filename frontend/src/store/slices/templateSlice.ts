/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITemplate } from "@/models/template.model";
import { createTemplateApi } from "@/api/template.api";

const initialState = {
  myTemplates: [] as ITemplate[],

  loading: {
    gettingTemplates: false,
    creatingTemplate: false,
  },
  error: "",
};

export const createTemplate = createAsyncThunk(
  "templates/create",
  async (data: ITemplate) => {
    const response = await createTemplateApi(data);
    return response;
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

        console.log("Fetched templates:", action.payload);
        state.myTemplates.push(action.payload);
      });
  },
});

export default templateSlice.reducer;
