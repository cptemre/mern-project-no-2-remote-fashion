interface InitialStateInterface {
  urls: {
    defaultFetchUrl: string;
    product: {
      get: string;
    };
  };
  categories: string[];
  subCategories: { [key: string]: string[] };
}

export type { InitialStateInterface };
