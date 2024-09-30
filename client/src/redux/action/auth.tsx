import { NavigateFunction } from "react-router-dom";
import { SIGNIN, SIGNUP } from "../../constants/types/actionType";
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
      console.log("Error Message from Server:", errorMessage); // Log error for debugging
      return { error: errorMessage };
    }
  };

export const signin =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      const response = await api.signIn(formData); // API call to backend
      const data = await dispatch({ type: SIGNIN, payload: response.data });
      console.log("Success:", data); // Log success for debugging
      navigate("/manager");
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      console.log("Error Message from Server:", errorMessage);
      return { error: errorMessage };
    }
  };
