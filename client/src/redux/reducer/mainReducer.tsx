import { combineReducers } from "redux";

import authReducer from "./auth";
import userReducer from "./user";
import companyReducer from "./company";
import questionReducer from "./question";
import answerReducer from "./answer";
import serveyReducer from "./servey";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  company: companyReducer,
  question: questionReducer,
  answer: answerReducer,
  survey: serveyReducer,
});
