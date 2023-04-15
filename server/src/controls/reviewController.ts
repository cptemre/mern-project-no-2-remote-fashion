// EXPRESS
import { RequestHandler } from "express";
// UTILITY FUNCTIONS
import findDocumentByIdAndModel from "../utilities/controllers/findDocumentByIdAndModel";
// MODELS
import { Review, Product } from "../models";
// HTTP CODES
import { StatusCodes } from "http-status-codes";
// INTERFACES
import { ReviewSchemaInterface } from "../utilities/interfaces";

const createReview: RequestHandler = async (req, res) => {
  // REVIEW KEYS FROM THE CLIENT TO CREATE A NEW REVIEW
  const {
    title,
    comment,
    rating,
    productId,
  }: Omit<ReviewSchemaInterface, "user | product"> & { productId: string } =
    req.body;
  // USER ID
  const userId = req.user?._id;

  // FIND THE PRODUCT
  const product = await findDocumentByIdAndModel({
    id: productId,
    MyModel: Product,
  });
  // CREATE THE REVIEW
  const review = await Review.create({
    title,
    comment,
    rating,
    user: userId,
    product: productId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "review created", product, review });
};

const deleteReview: RequestHandler = async (req, res) => {
  // GET REVIEW ID
  const { id: reviewId } = req.params;
  // USER AUTH ID
  const userId: string = req.user?._id;
  // FIND REVIEW FROM DB
  const review = await findDocumentByIdAndModel({
    id: reviewId,
    user: userId,
    MyModel: Review,
  });
  // DELETE REVIEW
  await Review.findOneAndDelete({ _id: reviewId });

  res.status(StatusCodes.OK).json({ msg: "review deleted" });
};

const updateReview: RequestHandler = async (req, res) => {
  // GET REVIEW ID
  const { id: reviewId } = req.params;
  // GET UPDATE VALUES FROM CLIENT BODY
  const {
    title,
    comment,
    rating,
  }: Omit<ReviewSchemaInterface, "user | product"> = req.body;
  // USER AUTH ID
  const userId: string = req.user?._id;
  // FIND THE REVIEW
  const review = await findDocumentByIdAndModel({
    id: reviewId,
    user: userId,
    MyModel: Review,
  });
  // UPDATE THE REVIEW DOCUMENT
  if (title) review.title = title;
  if (comment) review.comment = comment;
  if (rating) review.rating = rating;
  // SAVE THE REVIEW AFTER UPDATE
  await review.save();
  // SEND RES
  res.status(StatusCodes.OK).json({ msg: "review updated", review });
};

const getSingleReview: RequestHandler = async (req, res) => {
  // GET REVIEW ID
  const { id: reviewId } = req.params;
  // GET IF YOU REQUIRE YOUR OWN REVIEWS
  const { myReview }: { myReview: string } = req.body;
  // USER AUTH ID
  const userId: string = myReview === "true" ? req.user?._id : null;
  // GET THE REVIEW
  const review = await findDocumentByIdAndModel({
    id: reviewId,
    user: userId,
    MyModel: Review,
  });
  res.status(StatusCodes.OK).json({ msg: "review fetched", review });
};

const getAllReviews: RequestHandler = async (req, res) => {
  // GET PRODUCT ID
  const { productId } = req.body;
  // GET REVIEW PAGE
  const { reviewPage, myReviews }: { reviewPage: number; myReviews: string } =
    req.body;
  // USER AUTH ID
  const userId: string = myReviews === "true" ? req.user?._id : null;
  // FIND THE REVIEW
  const product = await findDocumentByIdAndModel({
    id: productId,
    user: userId,
    MyModel: Product,
  });
  // FIND THE REVIEWS BY PRODUCT ID AND USER ID IF REQUIRED
  const query: { product: string; user?: string } = { product: "" };
  query.product = productId;
  if (myReviews === "true") query.user = req.user?._id;
  // SKIP NECESSARY PART AND LIMIT IT TO 10
  const limit = 10;
  const skip = limit * reviewPage ? reviewPage - 1 : 0;
  const result = Review.find(query);
  const reviews = await result.skip(skip).limit(limit);
  res.status(StatusCodes.OK).json({ msg: "reviews fetched", product, reviews });
};

export {
  getAllReviews,
  getSingleReview,
  createReview,
  deleteReview,
  updateReview,
};
