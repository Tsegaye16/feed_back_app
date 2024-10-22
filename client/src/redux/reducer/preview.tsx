import { GET_PREVIEW_DATA } from "../../constants/types/actionType";

const previewState = {
  previewData: null,
};

const previewReducer = (state = previewState, action: any) => {
  switch (action.type) {
    case GET_PREVIEW_DATA:
      return { ...state, previewData: action.payload };
    default:
      return state;
  }
};

export default previewReducer;
