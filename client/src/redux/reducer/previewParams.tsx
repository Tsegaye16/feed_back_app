import { createSlice } from "@reduxjs/toolkit";
import { getPreviewParams } from "../action/company";

const previewParamSlice = createSlice({
  name: "previewParam",
  initialState: {
    param: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPreviewParams.fulfilled, (state, action) => {
      state.param = action.payload;
    });
  },
});

export default previewParamSlice.reducer;
