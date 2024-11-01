import { GET_STAT_DATA } from "../../constants/types/actionType";

const statState = {
  statData: null,
};

const statReducer = (state = statState, action: any) => {
  switch (action.type) {
    case GET_STAT_DATA:
      return { ...state, statData: action.payload };
    default:
      return state;
  }
};

export default statReducer;
