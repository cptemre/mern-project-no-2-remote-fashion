interface GetAllProductsQueryInterface {
  name: string;
  brand: string;
  color: string;
  size: string;
  price: { $gte: number | undefined; $lte: number | undefined };
  numberOfReviews: { $gt: number };
  stock: { $gt: number };
  rating: number;
  gender: "M" | "F" | "B";
  page: number;
  seller: string;
}

export default GetAllProductsQueryInterface;
