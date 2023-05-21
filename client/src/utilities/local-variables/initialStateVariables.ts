// INITIAL STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
// CURRENCY TYPE
import {
  AcceptableCurrinciesInterface,
  SelectedCurrencyType,
} from "../interfaces/payment/paymentInterfaces";

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

// PAYMENT
const acceptableCurrencies: AcceptableCurrinciesInterface = {
  GBP: "&#163;",
  USD: "&#36;",
  PLN: "&#122;&#322;",
  EURO: "&#36;",
};

const currencyKeys = Object.keys(
  acceptableCurrencies
) as Array<SelectedCurrencyType>;

const selectedCurrency = currencyKeys[0];

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
  acceptableCurrencies,
  selectedCurrency,
};
