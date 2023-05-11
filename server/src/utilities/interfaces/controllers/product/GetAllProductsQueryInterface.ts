import { RegexInterface } from "../";

interface GetAllProductsQueryInterface {
  name: RegexInterface["regex"];
  brand: RegexInterface["regex"];
  color: RegexInterface["regex"];
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
