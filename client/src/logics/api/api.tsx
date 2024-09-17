import axios from "axios";
import { AuthFormData } from "../../constants/types/dataType";
const API = axios.create({
  baseURL: "http://localhost:4000/user",
});

export const signIn = async (formData: any) => API.post("/signin", formData);

export const signUp = async (formData: AuthFormData) =>
  API.post("/signup", formData);

export const getUserById = async (userId: any) => API.get(`/getuser/${userId}`);
