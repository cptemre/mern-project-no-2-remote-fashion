// OPTIONS
import { AllOptions, AllSubOptions, selectedOption } from "./optionsInterfaces";
// CURRENCY TYPE
import {
  AcceptableCurrinciesInterface,
  SelectedCurrencyType,
} from "../payment/paymentInterfaces";

// CATEGORIES
type CategoriesType = "CLOTHES" | "SHOES";
type subCategoriesType = "MALE" | "FEMALE";

interface InitialStateInterface {
  category: {
    categories: CategoriesType[];
    subCategories: { [key in subCategoriesType]: string[] };
  };
  options: {
    allOptions: AllOptions;
    selectedOption: selectedOption;
    selectedSubOption: AllSubOptions;
  };
  booleans: {
    isRegisterButton: boolean;
    isForgotPassword: boolean;
    isLogged: boolean;
    isError: boolean;
    isOptionButton: boolean;
  };
  css: {
    underlineWidth1: string;
    underlineWidth2: string;
    transitionMs: number;
  };
  urls: {
    defaultFetchUrl: string;
    product: {
      get: string;
    };
  };
  payments: {
    acceptableCurrencies: AcceptableCurrinciesInterface;
    selectedCurrency: SelectedCurrencyType;
  };
}

export type { InitialStateInterface, CategoriesType };
