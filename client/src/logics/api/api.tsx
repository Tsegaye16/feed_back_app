import axios from "axios";
import { AuthFormData } from "../../constants/types/dataType";

const API = axios.create({
  baseURL: "http://localhost:5000/",
  //baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:5001",
});
export const signUp = async (formData: AuthFormData) =>
  API.post("/user/signup", formData);
