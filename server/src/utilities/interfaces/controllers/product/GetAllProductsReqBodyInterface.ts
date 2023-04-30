import { ObjectId } from "mongoose";

interface GetAllProductsReqBodyInterface {
  name: string;
  brand: string;
  color: string;
  size: string;
  price: string;
  isReview: boolean;
  isStock: boolean;
  rating: string;
  gender: "M" | "F" | "B";
  page: string;
  myProducts: boolean;
  seller: ObjectId;
}

export default GetAllProductsReqBodyInterface;
