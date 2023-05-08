import express from "express";
const router = express.Router();

import { uploadImages } from "../controls/imageController";

import { authUser, authRole } from "../middlewares/authorization";

router
  .route("/upload")
  .post(authUser, authRole("admin", "seller"), uploadImages);

export default router;
