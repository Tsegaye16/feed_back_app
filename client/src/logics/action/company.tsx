import { SAVE_COMPANY_DATA } from "../../constants/types/actionType";
import * as api from "../api/api";

export const addCompanyInfo = (companyData: any) => async (dispatch: any) => {
  try {
    const response = await api.addCompanyInfo(companyData);
    dispatch({ type: SAVE_COMPANY_DATA, payload: response.data });
  } catch (error) {
    console.error(error);
  }
};
