import {
  SUBMIT_ANSWER,
  GET_ALL_FEEDBACK,
} from "../../constants/types/actionType";

const answerState = {
  answerDaata: null,
};

const answerReducer = (state = answerState, action: any) => {
  switch (action.type) {
    case SUBMIT_ANSWER:
      return { ...state, answerDaata: action.payload };
    case GET_ALL_FEEDBACK:
      return { ...state, answerDaata: action.payload };
    default:
      return state;
  }
};

export default answerReducer;
