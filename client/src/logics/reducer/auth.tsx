import {
  SIGNIN,
  SIGNUP,
  LOGOUT,
  GET_USER_BY_ID,
} from "../../constants/types/actionType";

// Define the initial state
const initialState = {
  authData: localStorage.getItem("user"),
};
const userState = {
  user: null,
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SIGNIN:
      localStorage.setItem("user", JSON.stringify({ ...action?.payload }));
      console.log("PPayLoad:", action.payload);
      return { ...state, authData: action?.payload };
    case LOGOUT:
      return { ...state, authData: null };
    case SIGNUP:
      // localStorage.setItem("user", JSON.stringify({ ...action?.payload }));

      return { ...state, authData: action?.payload };
    case GET_USER_BY_ID:
      console.log("Get user:", action.payload);
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default authReducer;
