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

export const addCompanyInfo = async (companyData: any) =>
  API.post("/addCompany", companyData);

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
export const getPreviewParams = async (serveyId: any) =>
  API.get(`/getPreviewParams/${serveyId}`);

export const getPreviewData = async (companyName: any, surveyId: any) =>
  API.get(`/getPreviewData/${companyName}/${surveyId}`);
