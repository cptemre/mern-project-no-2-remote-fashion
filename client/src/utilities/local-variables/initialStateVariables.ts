import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";

// CATEGORY
const categories: InitialStateInterface["category"]["categories"] = [
  "CLOTHES",
  "SHOES",
];
const subCategories: InitialStateInterface["category"]["subCategories"] = {
  MALE: ["CAT1", "CAT2"],
  FEMALE: ["CAT3", "CAT4"],
};

// OPTIONS
const allOptions: InitialStateInterface["options"]["allOptions"] = {
  user: {
    PRODUCTS: ["NEW", "BEST", "ALL"],
    ORDERS: ["SINGLE ORDERS", "ALL ORDERS"],
  },
};
const selectedOption: InitialStateInterface["options"]["selectedOption"] =
  "PRODUCTS";
const selectedSubOption: InitialStateInterface["options"]["selectedSubOption"] =
  "ALL";

// CSS
const underlineWidth = 2;
const underlineWidth1 = underlineWidth + "rem";
const underlineWidth2 = underlineWidth * 2 + "rem";
const transitionMs = 200;
// URL
const defaultFetchUrl = "/api/v1/";

export {
  defaultFetchUrl,
  underlineWidth1,
  underlineWidth2,
  categories,
  subCategories,
  transitionMs,
  selectedOption,
  selectedSubOption,
  allOptions,
};
