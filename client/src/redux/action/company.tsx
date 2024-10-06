import {
  SAVE_COMPANY_DATA,
  GATE_COMPANY_BY_MANAGER_ID,
  ADD_TRUE_FALSE_QUESTION,
  GET_ALL_QUESTIONS,
  DELETE_TRUE_FALSE_QUESTION,
  UPDATE_TRUE_FALSE_QUESTION,
  ADD_CHOICE_QUESTION,
  SUBMIT_ANSWER,
  ADD_SERVEY,
  GET_ALL_SERVEY,
  DELETE_SERVEY,
  ADD_QUESTION,
  GET_PREVIEW_PARAMS,
  GET_PREVIEW_DATA,
  GET_QUESTION_BY_SURVEY_ID,
  DELETE_QUESTION_BY_ID,
  UPDATE_QUESTION,
  GET_FULL_SURVEY,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const addCompanyInfo = (companyData: any) => async (dispatch: any) => {
  try {
    const response = await api.addCompanyInfo(companyData);
    const data = await dispatch({
      type: SAVE_COMPANY_DATA,
      payload: response.data,
    });
    return data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage); // Log error for debugging
    return { error: errorMessage };
  }
};

export const getCompanyById = (managerId: any) => async (dispatch: any) => {
  try {
    const response = await api.getCompanyByManagerId(managerId);
    dispatch({ type: GATE_COMPANY_BY_MANAGER_ID, payload: response.data });
  } catch (error) {
    console.error(error);
  }
};

export const addTrueFalseQuestion =
  (questionData: any) => async (dispatch: any) => {
    try {
      const response = await api.addTrueFalseQuestion(questionData);
      dispatch({ type: ADD_TRUE_FALSE_QUESTION, payload: response.data });
    } catch (error) {
      console.error(error);
    }
  };

export const getAllQuestion = (companyId: any) => async (dispatch: any) => {
  try {
    const response = await api.getAllQuestions(companyId);

    dispatch({ type: GET_ALL_QUESTIONS, payload: response.data });
  } catch (error) {
    console.error(error);
  }
};

export const updateTrueFalseQuestion =
  (id: any, questionData: any) => async (dispatch: any) => {
    try {
      const response = await api.updateTrueFalse(id, questionData);
      dispatch({
        type: UPDATE_TRUE_FALSE_QUESTION,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

// Add this action for deleting a question
export const deleteTrueFalseQuestion = (id: any) => async (dispatch: any) => {
  try {
    const response = await api.deleteTrueFalse(id);
    dispatch({
      type: DELETE_TRUE_FALSE_QUESTION,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const addChoiceQuestion =
  (questionData: any) => async (dispatch: any) => {
    try {
      const response = await api.addChoiceQuestion(questionData);

      const data = await dispatch({
        type: ADD_CHOICE_QUESTION,
        payload: response.data,
      });
      return data;
    } catch (err) {
      console.error(err);
    }
  };

export const submitAnswer = (answerData: any) => async (dispatch: any) => {
  try {
    const response = await api.submitAnswer(answerData);
    dispatch({
      type: SUBMIT_ANSWER,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const addServey = (serveyInfo: any) => async (dispatch: any) => {
  try {
    const response = await api.addServey(serveyInfo);
    const data = await dispatch({ type: ADD_SERVEY, payload: response.data });
    return data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage); // Log error for debugging
    return { error: errorMessage };
  }
};

export const getAllServey = (companyId: any) => async (dispatch: any) => {
  try {
    const response = await api.getAllServey(companyId);
    const data = await dispatch({
      type: GET_ALL_SERVEY,
      payload: response.data,
    });
    console.log("data:", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteServey = (id: any) => async (dispatch: any) => {
  try {
    const response = await api.deleteServey(id);
    const data = await dispatch({
      type: DELETE_SERVEY,
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

export const addQuestion = (questionInfo: any) => async (dispatch: any) => {
  try {
    const response = await api.addQuestion(questionInfo);
    const data = await dispatch({ type: ADD_QUESTION, payload: response.data });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage); // Log error for debugging
    return { error: errorMessage };
  }
};
export const getPreviewParams = (serveyId: any) => async (dispatch: any) => {
  try {
    const response = await api.getPreviewParams(serveyId);
    const data = await dispatch({
      type: GET_PREVIEW_PARAMS,
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

export const getPreviewData =
  (companyName: any, surveyId: any) => async (dispatch: any) => {
    try {
      const response = await api.getPreviewData(companyName, surveyId);
      const data = await dispatch({
        type: GET_PREVIEW_DATA,
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

export const getQuestionBySurveyId = (id: any) => async (dispatch: any) => {
  try {
    const response = await api.getQuestionBySurveyId(id);
    const data = await dispatch({
      type: GET_QUESTION_BY_SURVEY_ID,
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

export const deleteQuestionById = (id: any) => async (dispatch: any) => {
  try {
    const response = await api.deleteQuestionById(id);
    const data = await dispatch({
      type: DELETE_QUESTION_BY_ID,
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

// Update the question
export const updateQuestion =
  (id: any, question: any) => async (dispatch: any) => {
    try {
      const response = await api.updateQuestion(id, question);
      const data = await dispatch({
        type: UPDATE_QUESTION,
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

// get full servey for client
export const getFullSurvey = (secretePhrase: any) => async (dispatch: any) => {
  try {
    const response = await api.getFullSurvey(secretePhrase);
    const data = await dispatch({
      type: GET_FULL_SURVEY,
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
