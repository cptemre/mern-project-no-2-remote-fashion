//* UTILITIES
// INTERFACES - DEFAULT STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
// DEFAULT STATE - LOCAL VARIABLES
import {
  defaultFetchUrl,
  categories,
  subCategories,
} from "./initialStateVariables";

const initialState: InitialStateInterface = {
  categories,
  subCategories,
  urls: {
    defaultFetchUrl,
    product: {
      get: defaultFetchUrl + "product/",
    },
  },
};

export default initialState;
