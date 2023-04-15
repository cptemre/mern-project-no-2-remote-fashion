// MONGOOSE
import { Schema, model, Types, Model, ObjectId } from "mongoose";
// INTERFACE
import {
  ReviewSchemaInterface,
  ReviewModelInterface,
} from "../utilities/interfaces";
// OTHER MODELS
import Product from "./Product";
import findDocumentByIdAndModel from "../utilities/controllers/findDocumentByIdAndModel";
const ReviewSchema = new Schema<ReviewSchemaInterface>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: [3, "title must be at least 3 characters"],
      maxlength: [30, "title can not be more than 35 characters"],
    },
    comment: {
      type: String,
      required: [true, "review is required"],
      minlength: [10, "review must be at least 10 characters"],
      maxlength: [1000, "review can not be more than 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      enum: {
        values: [1, 2, 3, 4, 5],
        message: "rating must be one of these values: 1,2,3,4,5",
      },
    },
    user: {
      type: Types.ObjectId,
      required: [true, "user id is required"],
      ref: "User",
    },
    product: {
      type: Types.ObjectId,
      required: [true, "product id is required"],
      ref: "Product",
    },
  },
  { timestamps: true }
);
// ENSURE THAT ONLY ONE REVIEW PER PRODUCT
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
// STATIC MODEL FUNCTION TO GROUP REVIEWS OF SAME PRODUCT BEFORE AND AFTER SAVE
ReviewSchema.statics.calculateAverageRating = async function (
  productId: ObjectId
) {
  try {
    const result = await this.aggregate([
      {
        $match: { product: productId },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          numberOfReviews: {
            $sum: 1,
          },
        },
      },
    ]);
    console.log(result);
    // QUERY OBJECT
    const findAndUpdateQuery: {
      averageRating: number;
      numberOfReviews: number;
    } = {
      averageRating: Number(result[0]?.averageRating) || 0,
      numberOfReviews: Number(result[0]?.numberOfReviews) || 0,
    };
    // FIND THE PRODUCT
    const product = await findDocumentByIdAndModel({
      id: productId.toString(),
      MyModel: Product,
    });
    // UPDATE THE PRODUCT
    product.averageRating = findAndUpdateQuery.averageRating;
    product.numberOfReviews = findAndUpdateQuery.numberOfReviews;
    await product.save();
  } catch (error) {
    console.log(error);
  }
};
ReviewSchema.post("save", async function () {
  await Review.calculateAverageRating(this.product);
});
ReviewSchema.post("findOneAndDelete", async function (doc) {
  await Review.calculateAverageRating(doc.product);
});
// MODEL NEEDS AN EXTRA EXTENDED INTERFACE TO BE ABLE TO RECOGNIZE THE STATIC FUNCTIONS
const Review: ReviewModelInterface = model<
  ReviewSchemaInterface,
  ReviewModelInterface
>("Review", ReviewSchema);

export default Review;
