import { SIGNIN, SIGNUP, LOGOUT } from "../../constants/types/actionType";

// Define the initial state
const initialState = {
  authData: localStorage.getItem("user"),
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SIGNIN:
      localStorage.setItem("user", action.payload.token);

      return { ...state, authData: action?.payload };
    case LOGOUT:
      return { ...state, authData: null };
    case SIGNUP:
      // localStorage.setItem("user", JSON.stringify({ ...action?.payload }));

      return { ...state, authData: action?.payload };

    default:
      return state;
  }
};

export default authReducer;
