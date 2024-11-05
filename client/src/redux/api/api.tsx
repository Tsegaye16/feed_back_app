import axios from "axios";
import { AuthFormData } from "../../constants/types/dataType";

const isLocal = window.location.hostname === "localhost";
const API = axios.create({
  baseURL: isLocal
    ? process.env.REACT_APP_LOCAL_API_BASE_URL
    : process.env.REACT_APP_PROD_API_BASE_URL,
});

export const signIn = async (formData: any) => {
  try {
    return await API.post("/signin", formData);
  } catch (error) {
    throw error;
  }
};

export const signUp = async (formData: AuthFormData) => {
  try {
    return API.post("/signup", formData);
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    return await API.get(`/getuser/${userId}`);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (id: any, data: any) => {
  try {
    return await API.put(`/updateprofile/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (password: any) => {
  try {
    return await API.put("/changepassword", password);
  } catch (error) {
    throw error;
  }
};

export const addCompanyInfo = async (companyData: any) => {
  try {
    return await API.post("/addCompany", companyData);
  } catch (error) {
    throw error;
  }
};

export const updateCompany = async (id: any, companyData: any) => {
  try {
    return await API.put(`/updateCompany/${id}`, companyData);
  } catch (error) {
    throw error;
  }
};

export const getCompanyByManagerId = async (managerId: any) => {
  try {
    return await API.get(`/company/${managerId}`);
  } catch (error) {
    throw error;
  }
};

export const getAllQuestions = async (companyId: any) => {
  try {
    return await API.get(`/getAllQuestions/${companyId}`);
  } catch (error) {
    throw error;
  }
};

export const submitAnswer = async (answerData: any) => {
  try {
    return await API.post("/submitAnswer", answerData);
  } catch (error) {
    throw error;
  }
};

export const addServey = async (serveyInfo: any) => {
  try {
    return await API.post("/addServey", serveyInfo);
  } catch (error) {
    throw error;
  }
};
export const getAllServey = async (companyId: any) => {
  try {
    return await API.get(`/getAllServey/${companyId}`);
  } catch (error) {
    throw error;
  }
};
export const deleteServey = async (id: any) => {
  try {
    return await API.delete("/deleteServey", { data: { id } });
  } catch (error) {
    throw error;
  }
};

export const addQuestion = async (questionInfo: any) => {
  try {
    return await API.post("/addQuestion", questionInfo);
  } catch (error) {
    throw error;
  }
};

export const updateQuestion = async (id: any, questionInfo: any) => {
  try {
    return await API.put(`/updateQuestion/${id}`, questionInfo);
  } catch (error) {
    throw error;
  }
};
export const getPreviewParams = async (serveyId: any) => {
  try {
    return await API.get(`/getPreviewParams/${serveyId}`);
  } catch (error) {
    throw error;
  }
};

export const getPreviewData = async (companyName: any, surveyId: any) => {
  try {
    return await API.get(`/getPreviewData/${companyName}/${surveyId}`);
  } catch (error) {
    throw error;
  }
};

export const getQuestionBySurveyId = async (id: any) => {
  try {
    return await API.get(`/getQuestionBySurveyId/${id}`);
  } catch (error) {
    throw error;
  }
};

export const deleteQuestionById = async (id: any) => {
  try {
    return await API.delete("/deleteQuestionById", { data: id });
  } catch (error) {
    throw error;
  }
};

// get full servey for client
export const getFullSurvey = async (secretePhrase: any) => {
  try {
    return await API.get(`/getFullSurvey/${secretePhrase}`);
  } catch (error) {
    throw error;
  }
};

export const getFeedback = async (companyId: any) => {
  try {
    return await API.get(`/getFeedback/${companyId}`);
  } catch (error) {
    throw error;
  }
};

export const getStatData = async (companyId: any) => {
  try {
    return await API.get(`/getStatData/${companyId}`);
  } catch (error) {
    throw error;
  }
};

export const getFeedbackDetail = async (surveyId: string) => {
  try {
    return await API.get(`/getFeedbackDetail/${surveyId}`);
  } catch (error) {
    throw error;
  }
};

export const getRecentFeedback = async (companyId: any) => {
  try {
    return await API.get(`/getRecentFeedback/${companyId}`);
  } catch (error) {
    throw error;
  }
};

export const publishSurvey = async (surveyId: string) => {
  try {
    return await API.put(`/publishSurvey/${surveyId}`);
  } catch (error) {
    throw error;
  }
};

export const checkSecretePhrase = async (phrase: any) => {
  try {
    return await API.post(`/checkSecretePhrase/`, phrase);
  } catch (error) {
    throw error;
  }
};

export const emailConfirmation = async (token: any) => {
  try {
    return await API.get(`/confirm-email/${token}`);
  } catch (error) {
    throw error;
  }
};

export const sortQuestion = async (data: any) => {
  try {
    return await API.put("/sortQuestion", data);
  } catch (error) {
    throw error;
  }
};
