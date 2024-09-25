import {
  SAVE_COMPANY_DATA,
  GATE_COMPANY_BY_MANAGER_ID,
  ADD_TRUE_FALSE_QUESTION,
  GET_ALL_QUESTIONS,
  DELETE_TRUE_FALSE_QUESTION,
  UPDATE_TRUE_FALSE_QUESTION,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const addCompanyInfo = (companyData: any) => async (dispatch: any) => {
  try {
    const response = await api.addCompanyInfo(companyData);
    dispatch({ type: SAVE_COMPANY_DATA, payload: response.data });
  } catch (error) {
    console.error(error);
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
