// Importing action type constants
import {
  GET_ALL_SERVEY,
  ADD_SERVEY,
  DELETE_SERVEY,
  GET_FULL_SURVEY,
  PUBLISH_SURVEY,
} from "../../constants/types/actionType";

// Define the shape of a Survey (example, adjust according to your actual data)
interface Survey {
  id: string;
  name: string;
  secretePhrase: string;
  isPublished: boolean;
  // Add other fields as necessary
}

// Define the shape of the state
interface SurveyState {
  survey: Survey | null;
}

// Define the action types
interface Action<T = any> {
  type: string;
  payload?: T;
}

// Initial state, with correct type
const initialState: SurveyState = {
  survey: null,
};

// Survey reducer with type safety
const serveyReducer = (
  state: SurveyState = initialState,
  action: Action
): SurveyState => {
  switch (action.type) {
    case ADD_SERVEY:
    case GET_ALL_SERVEY:
    case DELETE_SERVEY:
      return { ...state, survey: action.payload as Survey };

    case GET_FULL_SURVEY:
    case PUBLISH_SURVEY:
      return { ...state, survey: action.payload as Survey };

    default:
      return state;
  }
};

export default serveyReducer;
