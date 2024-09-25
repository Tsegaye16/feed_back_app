import axios from "axios";
import { AuthFormData } from "../../constants/types/dataType";
const API = axios.create({
  baseURL: "http://localhost:4000/user",
});

export const signIn = async (formData: any) => {
  console.log("Form Data", formData);
  const response = await API.post("/signin", formData);

  return response;
};

export const signUp = async (formData: AuthFormData) =>
  API.post("/signup", formData);

export const getUserById = async (userId: any) => API.get(`/getuser/${userId}`);

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
