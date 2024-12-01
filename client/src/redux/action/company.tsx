import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  SAVE_COMPANY_DATA,
  GATE_COMPANY_BY_MANAGER_ID,
  GET_ALL_QUESTIONS,
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
  UPDATE_COMPANY,
  PUBLISH_SURVEY,
  SORT_QUESTION,
} from "../../constants/types/actionType";
import * as api from "../api/api";

export const addCompanyInfo = createAsyncThunk(
  SAVE_COMPANY_DATA,
  async (companyData: any, { rejectWithValue }) => {
    try {
      const response = await api.addCompanyInfo(companyData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateCompany = createAsyncThunk(
  UPDATE_COMPANY,
  async (
    { id, companyData }: { id: any; companyData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.updateCompany(id, companyData);

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getCompanyById = createAsyncThunk(
  GATE_COMPANY_BY_MANAGER_ID,
  async (managerId: string, { rejectWithValue }) => {
    try {
      const response = await api.getCompanyByManagerId(managerId);

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getAllQuestion = createAsyncThunk(
  GET_ALL_QUESTIONS,
  async (companyId: any, { rejectWithValue }) => {
    try {
      const response = await api.getAllQuestions(companyId);
      console.log("response.data: ", response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const addQuestion = createAsyncThunk(
  ADD_QUESTION,
  async (questionInfo: any, { rejectWithValue }) => {
    try {
      const response = await api.addQuestion(questionInfo);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getQuestionBySurveyId = createAsyncThunk(
  GET_QUESTION_BY_SURVEY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.getQuestionBySurveyId(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteQuestionById = createAsyncThunk(
  DELETE_QUESTION_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.deleteQuestionById(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateQuestion = createAsyncThunk(
  UPDATE_QUESTION,
  async ({ id, question }: { id: any; question: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateQuestion(id, question);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// export const sortQuestion = (formData: any) => async (dispatch: any) => {
//   try {
//     const response = await api.sortQuestion(formData);
//     const data = await dispatch({
//       type: SORT_QUESTION,
//       payload: response.data,
//     });
//     return data;
//   } catch (error: any) {
//     const errorMessage =
//       error.response?.data?.message || "Something went wrong";
//     // Log error for debugging
//     return { error: errorMessage };
//   }
// };

export const sortQuestion = createAsyncThunk(
  SORT_QUESTION,
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await api.sortQuestion(formData);
      console.log("Sorte data: ", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const addServey = createAsyncThunk(
  ADD_SERVEY,
  async (serveyInfo: any, { rejectWithValue }) => {
    try {
      const response = await api.addServey(serveyInfo);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const publishSurvey = createAsyncThunk(
  PUBLISH_SURVEY,
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const response = await api.publishSurvey(surveyId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getAllServey = createAsyncThunk(
  GET_ALL_SERVEY,
  async (companyId: any, { rejectWithValue }) => {
    try {
      const response = await api.getAllServey(companyId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteServey = createAsyncThunk(
  DELETE_SERVEY,
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.deleteServey(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getPreviewParams = createAsyncThunk(
  GET_PREVIEW_PARAMS,
  async (serveyId: any, { rejectWithValue }) => {
    try {
      const response = await api.getPreviewParams(serveyId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getPreviewData = createAsyncThunk(
  GET_PREVIEW_DATA,
  async (
    { companyName, surveyId }: { companyName: any; surveyId: any },
    { rejectWithValue }
  ) => {
    try {
      console.log(companyName);
      const response = await api.getPreviewData(companyName, surveyId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

interface FullSurveyResponse {
  questionData: { serveyId: string };
  companyData: { name: string };
  message: string;
}
export const getFullSurvey = createAsyncThunk(
  GET_FULL_SURVEY,
  async (secretePhrase: string, { rejectWithValue }) => {
    try {
      const response = await api.getFullSurvey(secretePhrase);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);
