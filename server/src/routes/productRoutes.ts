import express from "express";
const router = express();

import { createProduct, getAllProducts } from "../controls/productControls";

import { authUser } from "../middlewares/authorization";

router.route("/").post(authUser, createProduct).get(getAllProducts);

export default router;
