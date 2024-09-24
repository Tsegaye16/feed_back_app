import { SAVE_COMPANY_DATA } from "../../constants/types/actionType";

const companyState = {
  company: null,
};

const companyReducer = (state = companyState, action: any) => {
  switch (action.type) {
    case SAVE_COMPANY_DATA:
      return { ...state, company: action.payload };
    default:
      return state;
  }
};

export default companyReducer;
