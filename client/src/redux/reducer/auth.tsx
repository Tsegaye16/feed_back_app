import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, AuthState } from "../../constants/types/dataType";
import { emailConfirmation, signin, signup } from "../action/auth";

const initialState: AuthState = {
  authData: null,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action: any) => {
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
