import { Document } from "mongoose";

interface ImageSchemaInterface extends Document {
  originalName: string;
  cryptoName: string;
  mimeType: string;
  size: number;
  url: string;
  type: "product" | "avatar";
}

export default ImageSchemaInterface;
