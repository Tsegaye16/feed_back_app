import { GET_USER_BY_ID } from "../../constants/types/actionType";
import * as api from "../api/api";

// Thunk action to get user by ID
export const getUserById = (userId: string) => async (dispatch: any) => {
  try {
    const response = await api.getUserById(userId);
    console.log("response: ", response);
    const data = await dispatch({
      type: GET_USER_BY_ID,
      payload: response.data,
    });

    return data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage);
    return { error: errorMessage };
  }
};
