import { createSlice } from "@reduxjs/toolkit";

import {
  SUBMIT_ANSWER,
  GET_ALL_FEEDBACK,
} from "../../constants/types/actionType";
import { getFeedback, submitAnswer } from "../action/answer";

const answerSlice = createSlice({
  name: "answer",
  initialState: {
    answers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswer.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.answers = action.payload;
        state.loading = false;
      })
      .addCase(submitAnswer.rejected, (state: any, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getFeedback.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFeedback.fulfilled, (state, action) => {
        state.answers = action.payload;
        state.loading = false;
      })
      .addCase(getFeedback.rejected, (state: any, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default answerSlice.reducer;
