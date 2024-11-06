import { createAsyncThunk } from "@reduxjs/toolkit";
import { CHECK_SECRETE_PHRASE } from "../../constants/types/actionType";
import * as api from "../api/api";

// export const checkSecretePhrase = (phrase: string) => async (dispatch: any) => {
//   try {
//     const response = await api.checkSecretePhrase({ phrase });
//     const data = await dispatch({
//       type: CHECK_SECRETE_PHRASE,
//       payload: response.data,
//     });
//     return data;
//   } catch (error: any) {
//     const errorMessage =
//       error.response?.data?.message || "Something went wrong";

//     return { error: errorMessage };
//   }
// };

export const checkSecretePhrase = createAsyncThunk(
  CHECK_SECRETE_PHRASE,
  async (phrase: string, { rejectWithValue }) => {
    try {
      const response = await api.checkSecretePhrase({ phrase });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
