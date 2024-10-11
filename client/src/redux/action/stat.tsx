import { GET_STAT_DATA } from "../../constants/types/actionType";
import * as api from "../api/api";

export const getStatData = (companyId: any) => async (dispatch: any) => {
  try {
    const response = await api.getStatData(companyId);
    const data = dispatch({ type: GET_STAT_DATA, payload: response.data });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage);
    return { error: errorMessage };
  }
};
