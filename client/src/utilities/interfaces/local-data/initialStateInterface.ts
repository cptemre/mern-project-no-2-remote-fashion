type CategoriesType = "CLOTHES" | "SHOES";
type subCategoriesType = "MALE" | "FEMALE";
interface InitialStateInterface {
  category: {
    categories: CategoriesType[];
    subCategories: { [key in subCategoriesType]: string[] };
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
