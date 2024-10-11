import {
  GET_USER_BY_ID,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  GET_STAT_DATA,
} from "../../constants/types/actionType";

const userState = {
  user: null,
};

const userReducer = (state = userState, action: any) => {
  switch (action.type) {
    case GET_USER_BY_ID:
      return { ...state, user: action.payload };
    case UPDATE_PROFILE:
      return { ...state, user: action.payload };
    case CHANGE_PASSWORD:
      return { ...state, user: action.payload };
    case GET_STAT_DATA:
      return { ...state, statData: action.payload };
    default:
      return state;
  }
};

export default userReducer;
