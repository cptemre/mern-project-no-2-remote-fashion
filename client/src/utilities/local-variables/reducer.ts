// INITIAL STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";

const reducer = (
  state: InitialStateInterface,
  action: {
    type: string;
    payload: any;
  }
) => {
  if (action.type === "SELECTED_CATEGORY") {
    return { ...state, selectedCategory: action.payload };
  }
  if (action.type === "IS_FORGOT_PASSWORD") {
    return {
      ...state,
      booleans: { ...state.booleans, isForgotPassword: action.payload },
    };
  }

  return state;
};

export default reducer;
