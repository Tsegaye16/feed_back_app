import {
  GET_ALL_SERVEY,
  ADD_SERVEY,
  DELETE_SERVEY,
  GET_FULL_SURVEY,
  PUBLISH_SURVEY,
} from "../../constants/types/actionType";

const serveyState = {
  survey: null,
};

const serveyReducer = (state = serveyState, action: any) => {
  switch (action.type) {
    case ADD_SERVEY:
      return { ...state, servey: action.payload };
    case GET_ALL_SERVEY:
      return { ...state, servey: action.payload };
    case DELETE_SERVEY:
      return { ...state, servey: action.payload };
    case GET_FULL_SURVEY:
      return { ...state, survey: action.payload };
    case PUBLISH_SURVEY:
      return { ...state, survey: action.payload };
    default:
      return state;
  }
};

export default serveyReducer;
