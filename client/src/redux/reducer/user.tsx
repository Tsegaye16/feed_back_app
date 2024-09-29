import { GET_USER_BY_ID } from "../../constants/types/actionType";

const userState = {
  user: null,
};

const userReducer = (state = userState, action: any) => {
  switch (action.type) {
    case GET_USER_BY_ID:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default userReducer;
