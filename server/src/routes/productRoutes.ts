import express from "express";
const router = express();

import {
  createProduct,
  getAllProducts,
  deleteProduct,
} from "../controls/productControls";

import { authUser, authRole } from "../middlewares/authorization";

router
  .route("/")
  .post(authUser, authRole("admin"), createProduct)
  .get(getAllProducts);

router.route("/:id").delete(deleteProduct);

export default router;
