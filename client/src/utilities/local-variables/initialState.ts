//* UTILITIES
// INTERFACES - DEFAULT STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
// DEFAULT STATE - LOCAL VARIABLES
import {
  defaultFetchUrl,
  categories,
  subCategories,
  underlineWidth1,
  underlineWidth2,
  transitionMs,
} from "./initialStateVariables";

const initialState: InitialStateInterface = {
  category: {
    categories,
    subCategories,
  },
  booleans: {
    isRegisterButton: false,
    isForgotPassword: false,
    isError: false,
  },
  css: {
    underlineWidth1,
    underlineWidth2,
    transitionMs,
  },
  urls: {
    defaultFetchUrl,
    product: {
      get: defaultFetchUrl + "product/",
    },
  },
};

export default initialState;
