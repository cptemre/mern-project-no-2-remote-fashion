import { Document, ObjectId } from "mongoose";

interface ImageSchemaInterface extends Document {
  originalName: string;
  cryptoName: string;
  mimeType: string;
  size: number;
  type: "product" | "avatar";
  url?: string;
  user?: ObjectId;
  product?: ObjectId;
  createdBy: ObjectId;
}

export default ImageSchemaInterface;
