import { createSlice } from "@reduxjs/toolkit";
import { getPreviewData } from "../action/company";

const previewSlice = createSlice({
  name: "preview",
  initialState: {
    preview: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPreviewData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviewData.fulfilled, (state, action) => {
        // console.log("Preview Data:", action.payload);
        state.loading = false;
        state.preview = action.payload;
      })
      .addCase(getPreviewData.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default previewSlice.reducer;
