type CategoriesType = "CLOTHES" | "SHOES";
type subCategoriesType = "MALE" | "FEMALE";
type selectedOption = "PRODUCTS" | "ORDERS" | "USERS";
interface InitialStateInterface {
  category: {
    categories: CategoriesType[];
    subCategories: { [key in subCategoriesType]: string[] };
  };
  options: {
    selectedOption: selectedOption;
  };
  booleans: {
    isRegisterButton: boolean;
    isForgotPassword: boolean;
    isError: boolean;
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
