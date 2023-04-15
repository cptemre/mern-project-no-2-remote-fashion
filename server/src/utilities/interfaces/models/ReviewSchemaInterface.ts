import { ObjectId, Document, Model } from "mongoose";

interface ReviewModelInterface extends Model<ReviewSchemaInterface> {
  calculateAverageRating(productId: ObjectId): Promise<void>;
}

interface ReviewSchemaInterface extends Document {
  title: string;
  comment: string;
  rating: 1 | 2 | 3 | 4 | 5;
  user: ObjectId;
  product: ObjectId;
}

export { ReviewSchemaInterface, ReviewModelInterface };
