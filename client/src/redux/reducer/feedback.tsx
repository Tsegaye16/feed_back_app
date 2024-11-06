import { createSlice } from "@reduxjs/toolkit";
import { getFeedbackDetail } from "../action/feedback";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedback: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedbackDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeedbackDetail.fulfilled, (state, action) => {
        state.feedback = action.payload;
        state.loading = false;
      })
      .addCase(getFeedbackDetail.rejected, (state: any, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default feedbackSlice.reducer;
