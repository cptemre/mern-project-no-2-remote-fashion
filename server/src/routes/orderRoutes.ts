import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getAllSingleOrders,
  getOrder,
  getSingleOrder,
  updateSingleOrder,
  currencyExchange,
} from "../controllers/orderController";

import { authRole, authUser } from "../middlewares/authorization";

router
  .route("/")
  .post(authUser, authRole("admin", "user"), createOrder)
  .get(authUser, authRole("admin", "user"), getAllOrders);

router.get(
  "/single-order",
  authUser,
  authRole("admin", "user", "seller", "courier"),
  getAllSingleOrders
);

router
  .route("/single-order/:id")
  .get(authUser, authRole("admin", "user", "seller", "courier"), getSingleOrder)
  .patch(authUser, authRole("admin", "seller", "courier"), updateSingleOrder);

router.get(
  "/currency-exchange",
  authUser,
  authRole("admin", "user"),
  currencyExchange
);

router.route("/:id").get(authUser, authRole("admin", "user"), getOrder);

export default router;
