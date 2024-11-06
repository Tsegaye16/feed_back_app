import { createSlice } from "@reduxjs/toolkit";
import {
  addCompanyInfo,
  getCompanyById,
  updateCompany,
} from "../action/company";

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCompanyInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCompanyInfo.fulfilled, (state, action) => {
        state.company = action.payload.result;
        state.loading = false;
        state.error = null;
      })
      .addCase(addCompanyInfo.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        // console.log("DDD: ", action.payload);
        state.company = action.payload.result;
        state.loading = false;
      })
      .addCase(updateCompany.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.company = action.payload.result;
        state.loading = false;
      });
  },
});

export default companySlice.reducer;
