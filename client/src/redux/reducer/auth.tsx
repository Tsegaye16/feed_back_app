import { createSlice } from "@reduxjs/toolkit";
import { emailConfirmation, signin, signup } from "../action/auth";

interface AuthState {
  authData: any | null; // Replace `any` with your actual auth data type
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
      })
      .addCase(signin.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
      })
      .addCase(signup.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(emailConfirmation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(emailConfirmation.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
      })
      .addCase(emailConfirmation.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
