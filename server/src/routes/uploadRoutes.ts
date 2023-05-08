import express from "express";
const router = express.Router();

import { uploadProductImages } from "../controls/uploadController";

import { authUser, authRole } from "../middlewares/authorization";

router
  .route("/product-images")
  .post(authUser, authRole("admin", "seller"), uploadProductImages);

export default router;
