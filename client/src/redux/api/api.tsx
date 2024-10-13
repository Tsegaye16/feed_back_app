import axios from "axios";
import { AuthFormData } from "../../constants/types/dataType";
const API = axios.create({
  baseURL: "http://localhost:4000/user",
});

export const signIn = async (formData: any) => API.post("/signin", formData);

export const signUp = async (formData: AuthFormData) =>
  API.post("/signup", formData);

export const getUserById = async (userId: string) =>
  API.get(`/getuser/${userId}`);

export const updateProfile = async (id: any, data: any) =>
  API.put(`/updateprofile/${id}`, data);

export const changePassword = async (password: any) =>
  API.put("/changepassword", password);

export const addCompanyInfo = async (companyData: any) =>
  API.post("/addCompany", companyData);

export const updateCompany = async (id: any, companyData: any) =>
  API.put(`/updateCompany/${id}`, companyData);

export const getCompanyByManagerId = async (managerId: any) =>
  API.get(`/company/${managerId}`);

export const addTrueFalseQuestion = async (questionData: any) =>
  API.post("/addTrueFalse", questionData);

export const getAllQuestions = async (companyId: any) =>
  API.get(`/getAllQuestions/${companyId}`);

export const updateTrueFalse = async (id: any, questionData: any) =>
  API.put(`/updateTrueFalse/${id}`, questionData);

export const deleteTrueFalse = async (id: any) =>
  API.delete(`/deleteTrueFalse/${id}`);
export const addChoiceQuestion = async (questionData: any) =>
  API.post("/addChoiceQuestion", questionData);

export const submitAnswer = async (answerData: any) =>
  API.post("/submitAnswer", answerData);

export const addServey = async (serveyInfo: any) =>
  API.post("/addServey", serveyInfo);
export const getAllServey = async (companyId: any) =>
  API.get(`/getAllServey/${companyId}`);
export const deleteServey = async (id: any) =>
  API.delete("/deleteServey", { data: { id } });

export const addQuestion = async (questionInfo: any) =>
  API.post("/addQuestion", questionInfo);

export const updateQuestion = async (id: any, questionInfo: any) =>
  API.put(`/updateQuestion/${id}`, questionInfo);
export const getPreviewParams = async (serveyId: any) =>
  API.get(`/getPreviewParams/${serveyId}`);

export const getPreviewData = async (companyName: any, surveyId: any) =>
  API.get(`/getPreviewData/${companyName}/${surveyId}`);

export const getQuestionBySurveyId = async (id: any) =>
  API.get(`/getQuestionBySurveyId/${id}`);

export const deleteQuestionById = async (id: any) =>
  API.delete("/deleteQuestionById", { data: id });

// get full servey for client
export const getFullSurvey = async (secretePhrase: any) =>
  API.get(`/getFullSurvey/${secretePhrase}`);

export const getFeedback = async (companyId: any) =>
  API.get(`/getFeedback/${companyId}`);

export const getStatData = async (companyId: any) =>
  API.get(`/getStatData/${companyId}`);

export const getFeedbackDetail = async (surveyId: string) =>
  API.get(`/getFeedbackDetail/${surveyId}`);

export const getRecentFeedback = async (companyId: any) =>
  API.get(`/getRecentFeedback/${companyId}`);

export const publishSurvey = async (surveyId: string) =>
  API.put(`/publishSurvey/${surveyId}`);

export const checkSecretePhrase = async (phrase: any) =>
  API.post(`/checkSecretePhrase/`, phrase);
