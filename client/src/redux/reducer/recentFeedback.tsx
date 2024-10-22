import { GET_RECENT_FEEDBACK } from "../../constants/types/actionType";

const recentFeedbackState = {
  recentFeedbackData: null,
};

const recentFeedbackReducer = (state = recentFeedbackState, action: any) => {
  switch (action.type) {
    case GET_RECENT_FEEDBACK:
      return { ...state, recentFeedbackData: action.payload };
    default:
      return state;
  }
};

export default recentFeedbackReducer;
