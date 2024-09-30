import {
  SAVE_COMPANY_DATA,
  GATE_COMPANY_BY_MANAGER_ID,
} from "../../constants/types/actionType";

const companyState = {
  companyData: null,
};

const companyReducer = (state = companyState, action: any) => {
  switch (action.type) {
    case SAVE_COMPANY_DATA:
      return { ...state, companyData: action.payload };
    case GATE_COMPANY_BY_MANAGER_ID:
      return { ...state, companyData: action.payload };

    default:
      return state;
  }
};

export default companyReducer;
