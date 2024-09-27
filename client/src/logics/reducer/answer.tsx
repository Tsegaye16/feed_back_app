import { SUBMIT_ANSWER } from "../../constants/types/actionType";

const answerState = {
  answerDaata: null,
};

const answerReducer = (state = answerState, action: any) => {
  switch (action.type) {
    case SUBMIT_ANSWER:
      return { ...state, answerDaata: action.payload };
    default:
      return state;
  }
};

export default answerReducer;
