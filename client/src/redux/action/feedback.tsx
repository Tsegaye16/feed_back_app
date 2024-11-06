import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  GET_FEEDBACK_DETAIL,
  GET_RECENT_FEEDBACK,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const getFeedbackDetail = createAsyncThunk(
  GET_FEEDBACK_DETAIL,
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const response = await api.getFeedbackDetail(surveyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getRecentFeedback = createAsyncThunk(
  GET_RECENT_FEEDBACK,
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await api.getRecentFeedback(companyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
