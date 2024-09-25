import {
  ADD_TRUE_FALSE_QUESTION,
  GET_ALL_QUESTIONS,
} from "../../constants/types/actionType";

const questionState = {
  questionDaata: null,
};

const questionReducer = (state = questionState, action: any) => {
  switch (action.type) {
    case ADD_TRUE_FALSE_QUESTION:
      return { ...state, questionDaata: action.payload };
    case GET_ALL_QUESTIONS:
      return { ...state, questionDaata: action.payload };
    default:
      return state;
  }
};

export default questionReducer;