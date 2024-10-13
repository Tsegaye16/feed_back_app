import { CHECK_SECRETE_PHRASE } from "../../constants/types/actionType";
import * as api from "../api/api";

export const checkSecretePhrase = (phrase: string) => async (dispatch: any) => {
  try {
    console.log("phrase: ", phrase);
    const response = await api.checkSecretePhrase({ phrase });
    const data = await dispatch({
      type: CHECK_SECRETE_PHRASE,
      payload: response.data,
    });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    console.log("Error Message from Server:", errorMessage);
    return { error: errorMessage };
  }
};
