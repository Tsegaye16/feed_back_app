import {
  GET_FEEDBACK_DETAIL,
  GET_RECENT_FEEDBACK,
} from "../../constants/types/actionType";

const feedbackState = {
  feedbackData: null,
};

const feedbackReducer = (state = feedbackState, action: any) => {
  switch (action.type) {
    case GET_FEEDBACK_DETAIL:
      return { ...state, feedbackData: action.payload };
    case GET_RECENT_FEEDBACK:
      return { ...state, feedbackData: action.payload };
    default:
      return state;
  }
};

export default feedbackReducer;
