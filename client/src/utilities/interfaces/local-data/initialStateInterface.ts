// OPTIONS
import { AllOptions, AllSubOptions, selectedOption } from "./optionsInterfaces";

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
}

export type { InitialStateInterface, CategoriesType };
