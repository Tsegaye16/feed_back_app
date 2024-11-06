import { createSlice } from "@reduxjs/toolkit";
import { addServey, deleteServey, getAllServey } from "../action/company";

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    survey: [] as any[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addServey.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addServey.fulfilled, (state, action: any) => {
        state.loading = false;
        if (Array.isArray(state.survey)) {
          state.survey.push(action.payload); // Add new survey to the array
        } else {
          state.survey = [action.payload]; // If state.survey is not an array, set it
        }
      })
      .addCase(addServey.rejected, (state: any, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllServey.fulfilled, (state, action) => {
        state.survey = action.payload.servey;
      })
      .addCase(deleteServey.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteServey.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.meta.arg; // Assuming this is an array of IDs

        // Filter out surveys whose IDs are in the deletedIds array
        state.survey = state.survey.filter(
          (survey: any) => !deletedIds.includes(survey.id)
        );
      })

      .addCase(deleteServey.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default surveySlice.reducer;
