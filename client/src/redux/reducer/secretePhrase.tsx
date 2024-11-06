import { createSlice } from "@reduxjs/toolkit";
//import { CHECK_SECRETE_PHRASE } from "../../constants/types/actionType";
import { checkSecretePhrase } from "../action/secretePhrase";

const secretePhraseSlice = createSlice({
  name: "secretePhrase",
  initialState: {
    phrase: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkSecretePhrase.fulfilled, (state, action) => {
      state.phrase = action.payload;
    });
  },
});

export default secretePhraseSlice.reducer;
