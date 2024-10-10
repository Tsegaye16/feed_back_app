import {
  GET_USER_BY_ID,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} from "../../constants/types/actionType";
import * as api from "../api/api";

// Thunk action to get user by ID
export const getUserById = (userId: string) => async (dispatch: any) => {
  try {
    const response = await api.getUserById(userId);

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

export const updateProfile = (id: any, data: any) => async (dispatch: any) => {
  try {
    console.log("DData:", data);
    const response = await api.updateProfile(id, data);
    const result = await dispatch({
      type: UPDATE_PROFILE,
      payload: response.data,
    });
    return result;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage);
    return { error: errorMessage };
  }
};

export const changePassword = (password: any) => async (dispatch: any) => {
  try {
    const response = await api.changePassword(password);
    const result = await dispatch({
      type: CHANGE_PASSWORD,
      payload: response.data,
    });
    return result;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage);
    return { error: errorMessage };
  }
};
