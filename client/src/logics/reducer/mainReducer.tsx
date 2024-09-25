import { combineReducers } from "redux";

import authReducer from "./auth";
import userReducer from "./user";
import companyReducer from "./company";
import questionReducer from "./question";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  company: companyReducer,
  question: questionReducer,
});
