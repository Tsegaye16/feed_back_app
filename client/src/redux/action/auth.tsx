//import { NavigateFunction } from "react-router-dom";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  EMAIL_CONFIRMATION,
  SIGNIN,
  SIGNUP,
} from "../../constants/types/actionType";
import * as api from "../api/api";
import {
  LoginData,
  RegisterData,
  AuthResponse,
} from "../../constants/types/dataType";
import { AxiosError } from "axios";

export const signup = createAsyncThunk(
  SIGNUP,
  async (formData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.signUp(formData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Email confirmation action
export const emailConfirmation = createAsyncThunk(
  EMAIL_CONFIRMATION,
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.emailConfirmation(token);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Sign in action
export const signin = createAsyncThunk(
  SIGNIN,
  async (formData: LoginData, { rejectWithValue }) => {
    try {
      const response = await api.signIn(formData);
      // Store the token in local storage
      const token = response.data.token;

      localStorage.setItem("user", token);
      return response.data; // Return the user data as payload
    } catch (error) {
      console.log("response: ", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);
