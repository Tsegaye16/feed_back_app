//import { NavigateFunction } from "react-router-dom";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  EMAIL_CONFIRMATION,
  SIGNIN,
  SIGNUP,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const signup = createAsyncThunk(
  SIGNUP,
  async (formData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.signUp(formData);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Email confirmation action
export const emailConfirmation = createAsyncThunk(
  EMAIL_CONFIRMATION,
  async (token: any, { rejectWithValue }) => {
    try {
      const response = await api.emailConfirmation(token);
      return response.data;
    } catch (error: any) {
      console.log("Error: ", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return errorMessage;
    }
  }
);

// Sign in action
export const signin = createAsyncThunk(
  SIGNIN,
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await api.signIn(formData);
      // Store the token in local storage
      const token = response.data.token; // Adjust based on your API response structure
      localStorage.setItem("user", token);
      return response.data; // Return the user data as payload
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
