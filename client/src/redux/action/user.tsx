import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GET_USER_BY_ID,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const getUserById = createAsyncThunk(
  GET_USER_BY_ID,
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.getUserById(userId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  UPDATE_PROFILE,
  async ({ id, data }: { id: any; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateProfile(id, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  CHANGE_PASSWORD,
  async (password: any, { rejectWithValue }) => {
    try {
      const response = await api.changePassword(password);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);
