"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const orderController_1 = require("../controls/orderController");
const authorization_1 = require("../middlewares/authorization");
router
    .route("/")
    .post(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), orderController_1.createOrder)
    .get(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), orderController_1.getAllOrders);
router.get("/single-order", authorization_1.authUser, (0, authorization_1.authRole)("admin", "user", "seller"), orderController_1.getAllSingleOrders);
router.get("/single-order/:id", authorization_1.authUser, (0, authorization_1.authRole)("admin", "user", "seller"), orderController_1.getSingleOrder);
router.get("/currency-exchange", authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), orderController_1.currencyExchange);
router
    .route("/:id")
    .get(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), orderController_1.getOrder)
    .patch(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user", "seller"), orderController_1.updateOrder);
exports.default = router;
