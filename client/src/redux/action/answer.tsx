import {
  SUBMIT_ANSWER,
  GET_ALL_FEEDBACK,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const submitAnswer = (answerData: any) => async (dispatch: any) => {
  try {
    const response = await api.submitAnswer(answerData);
    const data = await dispatch({
      type: SUBMIT_ANSWER,
      payload: response.data,
    });
    return data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage); // Log error for debugging
    return { error: errorMessage };
  }
};

export const getFeedback = (companyId: any) => async (dispatch: any) => {
  try {
    const response = await api.getFeedback(companyId);
    const data = await dispatch({
      type: GET_ALL_FEEDBACK,
      payload: response.data,
    });
    return data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage); // Log error for debugging
    return { error: errorMessage };
  }
};
