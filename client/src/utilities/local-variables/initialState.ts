//* UTILITIES
// INTERFACES - DEFAULT STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
// DEFAULT STATE - LOCAL VARIABLES
import { categories } from "./localVariables";
const reducer = (
  state: InitialStateInterface,
  action: {
    type: string;
    payload?: any;
  }
) => {
  if (action.type === "TEST") {
    console.log(action.payload);
    return { ...state, localVariables: action.payload };
  }
  return state;
};

const initialState: InitialStateInterface = {
  localVariables: {
    categories,
  },
  urls: {
    defaultFetchUrl: "/api/v1/",
    product: {
      get: "",
    },
  },
};

export { reducer, initialState };
