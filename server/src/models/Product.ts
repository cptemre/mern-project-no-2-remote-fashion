import { Schema, model, Types } from "mongoose";
// INTERFACE
import { ProductSchemaInterface } from "../utilities/interfaces/models";
// ALL SUB CATEGORIES
import { allSubCategories, currencyList } from "../utilities/categories";
// MODELS
import { Review, User } from "../models";
const ProductSchema = new Schema<ProductSchemaInterface>(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      minlength: [4, "product name must be at least 4 characters"],
      maxlength: [50, "product name can not be more than 50 characters"],
    },
    brand: {
      type: String,
      required: [true, "product name is required"],
      minlength: [2, "brand name must be at least 2 characters"],
      maxlength: [15, "brand name can not be more than 15 characters"],
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
    },
    currency: {
      type: String,
      enum: {
        values: currencyList,
        message: `currency must be one of these: ${currencyList}`,
      },
      required: false,
      default: "gbp",
    },
    tax: {
      type: Number,
      required: [true, "product tax percentage is required"],
    },
    images: {
      type: [Types.ObjectId],
      required: [true, "image id is required"],
    },
    description: [
      {
        type: String,
        required: [true, "product description is required"],
      },
    ],
    gender: {
      type: String,
      enum: {
        values: ["M", "F", "B"],
        message: "gender value must be 'M', 'F' or 'B'",
      },
      required: [true, "product gender is required"],
    },
    category: {
      type: String,
      required: [true, "product category is required"],
      enum: {
        values: ["clothes", "shoes"],
        message: "product category must be 'clothes' or 'shoes'",
      },
    },
    subCategory: {
      type: String,
      required: [true, "product sub-category is required"],
      minlength: [3, "product sub-category must be at least 3 characters"],
      maxlength: [
        25,
        "product sub-category can not be more than 25 characters",
      ],
      enum: {
        values: allSubCategories,
        message: "product sub-category does not match with an expected value",
      },
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    seller: Types.ObjectId,
  },
  { timestamps: true }
);

ProductSchema.post("findOneAndDelete", async function (doc) {
  const productId = doc._id;
  // FIND ALL REVIEWS WITH THE PRODUCT ID MATCH
  const reviews = await Review.find({ product: productId });
  // FIND AND DELETE EVERY DOCUMENT FROM REVIEWS ARRAY WITH A LOOP
  for (let i = 0; i < reviews.length; i++) {
    await Review.findOneAndDelete({ _id: reviews[i]._id });
  }
  // FIND ALL USERS WHOSE cartItems ARRAY CONTAINS AN ITEM WITH THE SPECIFIED _id, AND REMOVE THAT ITEM FROM THE ARRAY.
  await User.updateMany(
    { "cartItems._id": productId },
    { $pull: { cartItems: { _id: productId } } }
  );
});

const Product = model<ProductSchemaInterface>("Product", ProductSchema);

export default Product;
