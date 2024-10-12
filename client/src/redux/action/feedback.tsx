import {
  GET_FEEDBACK_DETAIL,
  GET_RECENT_FEEDBACK,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const getFeedbackDetail =
  (surveyId: string) => async (dispatch: any) => {
    try {
      const response = await api.getFeedbackDetail(surveyId);
      const data = await dispatch({
        type: GET_FEEDBACK_DETAIL,
        payload: response.data,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      console.log("Error Message from Server:", errorMessage); // Log error for debugging
      return { error: errorMessage };
    }
  };

export const getRecentFeedback =
  (companyId: string) => async (dispatch: any) => {
    try {
      const response = await api.getRecentFeedback(companyId);
      const data = await dispatch({
        type: GET_RECENT_FEEDBACK,
        payload: response.data,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      console.log("Error Message from Server:", errorMessage); // Log error for debugging
      return { error: errorMessage };
    }
  };
