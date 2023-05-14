export interface InitialStateInterface {
  urls: {
    defaultFetchUrl: string;
    product: {
      get: string;
    };
  };
  localVariables: {
    categories: string[];
  };
}
