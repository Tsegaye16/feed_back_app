import { NavigateFunction } from "react-router-dom";
import {
  GET_USER_BY_ID,
  SIGNIN,
  SIGNUP,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const signup =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      console.log("Form Data: ", formData);
      const { data } = await api.signUp(formData);

      dispatch({ type: SIGNUP, payload: data });
    } catch (err) {
      console.log("Error:", err);
    }
  };

export const signin =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      console.log("Data: ", formData);
      const { data } = await api.signIn(formData); // Ensure the API method is named correctly
      console.log("DData:", data.token);
      dispatch({ type: SIGNIN, payload: data });
      navigate("/manager");
    } catch (err) {
      console.log(err);
    }
  };

export const getUserById = (userId: any) => async (dispatch: any) => {
  try {
    const { data } = await api.getUserById(userId);
    console.log("Data:", data);
    dispatch({ type: GET_USER_BY_ID, payload: data });
  } catch (err) {
    console.log(err);
  }
};
