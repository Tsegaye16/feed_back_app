import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  SUBMIT_ANSWER,
  GET_ALL_FEEDBACK,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const submitAnswer = createAsyncThunk(
  SUBMIT_ANSWER,
  async (answerData: any, { rejectWithValue }) => {
    try {
      const response = await api.submitAnswer(answerData);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getFeedback = createAsyncThunk(
  GET_ALL_FEEDBACK,
  async (companyId: any, { rejectWithValue }) => {
    try {
      const response = await api.getFeedback(companyId);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
