import {
  GET_FEEDBACK_DETAIL,
  CLEAR_DATA,
} from "../../constants/types/actionType";

const feedbackState = {
  feedbackData: null,
};

const feedbackReducer = (state = feedbackState, action: any) => {
  switch (action.type) {
    case GET_FEEDBACK_DETAIL:
      return { ...state, feedbackData: action.payload };
    case CLEAR_DATA:
      return { ...state, feedbackData: null };
    default:
      return state;
  }
};

export default feedbackReducer;
