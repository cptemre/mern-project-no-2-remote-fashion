import express from "express";
const router = express();

import {
  createProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct,
  updateProduct,
} from "../controls/productControls";

import { authUser, authRole } from "../middlewares/authorization";

router
  .route("/")
  .post(authUser, authRole("admin", "seller"), createProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .delete(authUser, authRole("admin", "seller"), deleteProduct)
  .patch(authUser, authRole("admin", "seller"), updateProduct);

export default router;
