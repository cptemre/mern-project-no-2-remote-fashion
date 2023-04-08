import express from "express";
const router = express();

import { createProduct, getAllProducts } from "../controls/productControls";

router.route("/").post(createProduct);

export default router;
