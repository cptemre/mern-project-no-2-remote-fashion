import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";

// URL
const defaultFetchUrl = "/api/v1/";

// CSS
const underlineWidth = 2;

// LOCAL VARIABLES
const categories: InitialStateInterface["categories"] = ["CLOTHES", "SHOES"];
const subCategories: InitialStateInterface["subCategories"] = {
  MALE: ["CAT1", "CAT2"],
  FEMALE: ["CAT3", "CAT4"],
};

export { defaultFetchUrl, underlineWidth, categories, subCategories };
