// Importing your action types (keeping these as constants is fine)
import {
  GET_USER_BY_ID,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  GET_STAT_DATA,
} from "../../constants/types/actionType";

// Define the shape of your user and stat data (example)
interface User {
  id: string;
  name: string;
  email: string;
}

interface StatData {
  totalSurveys: number;
  totalResponses: number;
}

// Define the state type
interface UserState {
  user: User | null;
  statData?: StatData;
}

// Define action type structure
interface Action<T = any> {
  type: string;
  payload?: T; // Allowing payload to be optional, but we can adjust this per action if necessary
}

// Initial state
const initialState: UserState = {
  user: null,
};

// User reducer with type safety
const userReducer = (
  state: UserState = initialState,
  action: Action
): UserState => {
  switch (action.type) {
    case GET_USER_BY_ID:
      return { ...state, user: action.payload as User };
    case UPDATE_PROFILE:
      return { ...state, user: action.payload as User };
    case CHANGE_PASSWORD:
      return { ...state, user: action.payload as User };
    case GET_STAT_DATA:
      return { ...state, statData: action.payload as StatData };
    default:
      return state;
  }
};

export default userReducer;
