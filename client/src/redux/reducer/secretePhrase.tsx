import { CHECK_SECRETE_PHRASE } from "../../constants/types/actionType";

const phraseState = {
  phraseData: null,
};

const secretePhrasekReducer = (state = phraseState, action: any) => {
  switch (action.type) {
    case CHECK_SECRETE_PHRASE:
      return { ...state, phraseData: action.payload };
    default:
      return state;
  }
};

export default secretePhrasekReducer;
