import { combineReducers } from "redux";

import authReducer from "./auth";
import userReducer from "./user";
import companyReducer from "./company";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  company: companyReducer,
});
