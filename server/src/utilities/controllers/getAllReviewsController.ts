import { StatusCodes } from "http-status-codes";
import { findDocumentByIdAndModel, limitAndSkip } from ".";
import { BadRequestError } from "../../errors";
import { Product, Review } from "../../models";
import { Response } from "express";

const getAllReviewsController = async ({
  userId,
  reviewPage,
  productId,
  res,
}: {
  userId?: string;
  reviewPage: number;
  productId?: string;
  res: Response;
}) => {
  // FIND THE REVIEW
  if (productId) {
    await findDocumentByIdAndModel({
      id: productId,
      MyModel: Product,
    });
  }

  // FIND THE REVIEWS BY PRODUCT ID AND USER ID IF REQUIRED
  const query: { product?: string; user?: string } = {};
  if (productId) query.product = productId;
  if (userId) query.user = userId;

  // LIMIT AND SKIP VALUES
  const myLimit = 5;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: reviewPage });
  const result = Review.find(query);
  const reviews = await result.skip(skip).limit(limit);
  const length = await Review.countDocuments(query);

  let msg: string;
  res
    .status(StatusCodes.OK)
    .json({ msg: "reviews fetched", result: reviews, length });
};

export default getAllReviewsController;
