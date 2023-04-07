interface GetAllProductsQueryInterface {
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  isReview: boolean;
  isStock: boolean;
  rating: number;
  gender: "M" | "F" | "B";
  page: number;
}

export default GetAllProductsQueryInterface;
