// INITIAL STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";

const reducer = (
  state: InitialStateInterface,
  action: {
    type: string;
    payload: any;
  }
) => {
  //* CATEGORIES
  if (action.type === "SELECTED_CATEGORY") {
    return {
      ...state,
      category: { ...state.category, allCategories: action.payload },
    };
  }
  //* OPTIONS
  // SUB OPTION
  if (action.type === "SELECTED_SUB_OPTION") {
    return {
      ...state,
      options: { ...state.options, selectedSubOption: action.payload },
    };
  }
  // OPTION
  if (action.type === "SELECTED_OPTION") {
    return {
      ...state,
      options: { ...state.options, selectedOption: action.payload },
    };
  }
  //* BOOLEANS
  if (action.type === "IS_FORGOT_PASSWORD") {
    return {
      ...state,
      booleans: { ...state.booleans, isForgotPassword: action.payload },
    };
  }
  if (action.type === "IS_OPTION_BUTTON") {
    return {
      ...state,
      booleans: { ...state.booleans, isOptionButton: action.payload },
    };
  }

  return state;
};

export default reducer;
