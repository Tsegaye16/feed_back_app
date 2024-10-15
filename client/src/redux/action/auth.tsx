import { NavigateFunction } from "react-router-dom";
import {
  EMAIL_CONFIRMATION,
  SIGNIN,
  SIGNUP,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const signup =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      const response = await api.signUp(formData);

      const data = await dispatch({ type: SIGNUP, payload: response.data });
      navigate("/login");
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";

      return { error: errorMessage };
    }
  };

export const emailConfirmation = (token: any) => async (dispatch: any) => {
  try {
    const response = await api.emailConfirmation(token);
    const data = await dispatch({
      type: EMAIL_CONFIRMATION,
      payload: response.data,
    });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";

    return { error: errorMessage };
  }
};

export const signin =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      const response = await api.signIn(formData); // API call to backend
      const data = await dispatch({ type: SIGNIN, payload: response.data });

      navigate("/manager");
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";

      return { error: errorMessage };
    }
  };
