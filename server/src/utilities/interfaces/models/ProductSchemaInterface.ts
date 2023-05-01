import { Document } from "mongoose";
import { ObjectId } from "mongoose";
import { CurrencyInterface } from "../payment";

interface ProductSchemaInterface extends Document, CurrencyInterface {
  name: string;
  brand: string;
  price: number;
  tax: number;
  image: string[];
  description: string[];
  size: string[];
  gender: "M" | "F" | "B";
  category: "clothes" | "shoes";
  subCategory: string;
  numberOfReviews: number;
  averageRating: number;
  stock: number;
  seller: ObjectId;
}

export default ProductSchemaInterface;
