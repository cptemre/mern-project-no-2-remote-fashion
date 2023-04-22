import { Document } from "mongoose";

interface ProductSchemaInterface extends Document {
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
}

export default ProductSchemaInterface;
