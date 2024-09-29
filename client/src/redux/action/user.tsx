import { GET_USER_BY_ID } from "../../constants/types/actionType";
import * as api from "../api/api";

export const getUserById = (userId: any) => async (dispatch: any) => {
  try {
    const { data } = await api.getUserById(userId);

    dispatch({ type: GET_USER_BY_ID, payload: data });
  } catch (err) {
    console.log(err);
  }
};
