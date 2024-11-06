import { createSlice } from "@reduxjs/toolkit";
import { getRecentFeedback } from "../action/feedback";

const recentFeedbackSlice = createSlice({
  name: "recentFeedback",
  initialState: {
    recentFeedback: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecentFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecentFeedback.fulfilled, (state, action) => {
        console.log("DAta action,", action.payload);
        state.recentFeedback = action.payload;
        state.loading = false;
      })
      .addCase(getRecentFeedback.rejected, (state: any, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default recentFeedbackSlice.reducer;
