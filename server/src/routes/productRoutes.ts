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
  .post(authUser, authRole("admin"), createProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .delete(authUser, authRole("admin"), deleteProduct)
  .patch(authUser, authRole("admin"), updateProduct);

export default router;
