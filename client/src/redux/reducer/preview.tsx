import { createSlice } from "@reduxjs/toolkit";
import { getPreviewData } from "../action/company";

const previewSlice = createSlice({
  name: "preview",
  initialState: {
    preview: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPreviewData.fulfilled, (state, action) => {
      console.log("Preview Data:", action.payload);
      state.preview = action.payload;
    });
  },
});

export default previewSlice.reducer;
