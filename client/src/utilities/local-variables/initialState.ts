//* UTILITIES
// INTERFACES - DEFAULT STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
// DEFAULT STATE - LOCAL VARIABLES
import { categories } from "./localVariables";

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

export default initialState;
