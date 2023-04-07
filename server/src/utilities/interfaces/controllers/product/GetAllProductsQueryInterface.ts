interface GetAllProductsQueryInterface {
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  isReview: boolean;
  stock: { $gt: number };
  rating: number;
  gender: "M" | "F" | "B";
  page: number;
}

export default GetAllProductsQueryInterface;
