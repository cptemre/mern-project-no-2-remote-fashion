import express from "express";
const router = express.Router();

import {
  uploadImages,
  getSignedUrls,
  deleteImage,
} from "../controllers/imageController";

import { authUser, authRole } from "../middlewares/authorization";

router
  .route("/:id")
  .patch(authUser, authRole("admin", "seller"), getSignedUrls)
  .delete(authUser, authRole("admin", "seller"), deleteImage);

router
  .route("/:type")
  .post(authUser, authRole("admin", "seller"), uploadImages);
export default router;
