import { GET_USER_BY_ID } from "../../constants/types/actionType";

const userState = {
  user: null,
};

const userReducer = (state = userState, action: any) => {
  switch (action.type) {
    case GET_USER_BY_ID:
      console.log("Get user:", action.payload);
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default userReducer;
