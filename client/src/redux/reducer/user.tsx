import { createSlice } from "@reduxjs/toolkit";
import { changePassword, getUserById, updateProfile } from "../action/user";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        console.log("Updating Info: ", action.payload);
        state.user = action.payload.newUser;
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.user = action.payload.result;
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
