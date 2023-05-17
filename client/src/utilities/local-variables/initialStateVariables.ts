import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";

// CSS
const underlineWidth = 2;

// CATEGORY
const categories: InitialStateInterface["category"]["categories"] = [
  "CLOTHES",
  "SHOES",
];
const subCategories: InitialStateInterface["category"]["subCategories"] = {
  MALE: ["CAT1", "CAT2"],
  FEMALE: ["CAT3", "CAT4"],
};

// URL
const defaultFetchUrl = "/api/v1/";

export { defaultFetchUrl, underlineWidth, categories, subCategories };
