interface GetAllProductsQueryInterface {
  name: string;
  brand: string;
  color: string;
  size: string;
  price: { $gte: number | undefined; $lte: number | undefined };
  isReview: boolean;
  stock: { $gt: number };
  rating: number;
  gender: "M" | "F" | "B";
  page: number;
  userId: string;
}

export default GetAllProductsQueryInterface;
