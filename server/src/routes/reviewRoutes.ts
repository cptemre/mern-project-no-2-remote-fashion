import express from "express";
const router = express();

import {
  getAllReviews,
  getMyAllReviews,
  getSingleReview,
  createReview,
  deleteReview,
  updateReview,
} from "../controls/reviewController";

import { authUser, authRole } from "../middlewares/authorization";

router
  .route("/")
  .get(getAllReviews)
  .post(authUser, authRole("admin", "user"), createReview);
router
  .route("/my-reviews")
  .get(authUser, authRole("admin", "user"), getMyAllReviews);
router
  .route("/:id")
  .get(getSingleReview)
  .delete(authUser, authRole("admin", "user"), deleteReview)
  .patch(authUser, authRole("admin", "user"), updateReview);

export default router;
