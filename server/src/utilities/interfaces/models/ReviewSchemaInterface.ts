import { ObjectId, Document } from "mongoose";

interface ReviewSchemaInterface extends Document {
  title: string;
  comment: string;
  rating: 1 | 2 | 3 | 4 | 5;
  user: ObjectId;
  product: ObjectId;
}

export default ReviewSchemaInterface;
