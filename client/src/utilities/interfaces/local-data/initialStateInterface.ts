type CategoriesType = "CLOTHES" | "SHOES";
type subCategoriesType = "MALE" | "FEMALE";
interface InitialStateInterface {
  categories: CategoriesType[];
  selectedCategory: CategoriesType;
  subCategories: { [key in subCategoriesType]: string[] };
  underlineWidth1: string;
  underlineWidth2: string;
  transitionMs: number;
  urls: {
    defaultFetchUrl: string;
    product: {
      get: string;
    };
  };
}

export type { InitialStateInterface, CategoriesType };
