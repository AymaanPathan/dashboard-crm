import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ILead } from "@/models/lead.model";
import { getOneLeadApi } from "@/api/lead.api";

const initialState = {
  lead: {} as ILead,
  loading: false,
  error: "",
};

export const getOneLeadbyId = createAsyncThunk(
  "lead/getOne",
  async (leadId: string) => {
    const response = await getOneLeadApi(leadId);
    return response;
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneLeadbyId.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getOneLeadbyId.fulfilled, (state, action) => {
      state.loading = false;
      state.lead = action.payload;
    });
    builder.addCase(getOneLeadbyId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default leadSlice.reducer;
