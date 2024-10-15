import {
  GET_ALL_QUESTIONS,
  SUBMIT_ANSWER,
  ADD_QUESTION,
  GET_PREVIEW_PARAMS,
  GET_QUESTION_BY_SURVEY_ID,
  DELETE_QUESTION_BY_ID,
  UPDATE_QUESTION,
} from "../../constants/types/actionType";

const questionState = {
  questionDaata: null,
};

const questionReducer = (state = questionState, action: any) => {
  switch (action.type) {
    case GET_ALL_QUESTIONS:
      return { ...state, questionDaata: action.payload };
    case SUBMIT_ANSWER:
      return { ...state, questionDaata: action.payload };
    case ADD_QUESTION:
      return { ...state, questionDaata: action.payload };
    case GET_PREVIEW_PARAMS:
      return { ...state, questionDaata: action.payload };
    case GET_QUESTION_BY_SURVEY_ID:
      return { ...state, questionDaata: action.payload };
    case DELETE_QUESTION_BY_ID:
      return { ...state, questionDaata: action.payload };
    case UPDATE_QUESTION:
      return { ...state, questionDaata: action.payload };
    default:
      return state;
  }
};

export default questionReducer;
