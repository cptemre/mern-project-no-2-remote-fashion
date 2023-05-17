//* UTILITIES
// INTERFACES - DEFAULT STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
// DEFAULT STATE - LOCAL VARIABLES
import {
  defaultFetchUrl,
  categories,
  subCategories,
  underlineWidth,
} from "./initialStateVariables";

const initialState: InitialStateInterface = {
  category: {
    categories,
    subCategories,
  },
  css: {
    underlineWidth1: underlineWidth + "rem",
    underlineWidth2: underlineWidth * 2 + "rem",
    transitionMs: 200,
  },
  urls: {
    defaultFetchUrl,
    product: {
      get: defaultFetchUrl + "product/",
    },
  },
};

export default initialState;
