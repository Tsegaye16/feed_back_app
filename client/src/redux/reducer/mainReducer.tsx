import { combineReducers } from "redux";

import authReducer from "./auth";
import userReducer from "./user";
import companyReducer from "./company";
import questionReducer from "./question";
import answerReducer from "./answer";
import serveyReducer from "./servey";
import previewReducer from "./preview";
import statReducer from "./stat";
import feedbackReducer from "./feedback";
import { LOGOUT } from "../../constants/types/actionType";
import recentFeedbackReducer from "./recentFeedback";
import secretePhrasekReducer from "./secretePhrase";
import previewParamReducer from "./previewParams";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  company: companyReducer,
  question: questionReducer,
  answer: answerReducer,
  survey: serveyReducer,
  preview: previewReducer,
  stat: statReducer,
  feedback: feedbackReducer,
  recentFeedback: recentFeedbackReducer,
  phrase: secretePhrasekReducer,
  param: previewParamReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    // Reset all state to initial values
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
