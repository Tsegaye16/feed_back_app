import { NavigateFunction } from "react-router-dom";
import { SIGNIN, SIGNUP } from "../../constants/types/actionType";
import * as api from "../api/api";

export const signup =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      const { data } = await api.signUp(formData);

      dispatch({ type: SIGNUP, payload: data });
    } catch (err) {}
  };

export const signin =
  (formData: any, navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      const { data } = await api.signIn(formData); // Ensure the API method is named correctly

      dispatch({ type: SIGNIN, payload: data });
      navigate("/manager");
    } catch (err) {
      console.log(err);
    }
  };
