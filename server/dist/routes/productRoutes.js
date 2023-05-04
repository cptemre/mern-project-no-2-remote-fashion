"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const productControls_1 = require("../controls/productControls");
const authorization_1 = require("../middlewares/authorization");
router
    .route("/")
    .post(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), productControls_1.createProduct)
    .get(productControls_1.getAllProducts);
router
    .route("/:id")
    .get(productControls_1.getSingleProduct)
    .delete(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), productControls_1.deleteProduct)
    .patch(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), productControls_1.updateProduct);
exports.default = router;
