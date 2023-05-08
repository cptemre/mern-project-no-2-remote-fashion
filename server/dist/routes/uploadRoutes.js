"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const uploadController_1 = require("../controls/uploadController");
const authorization_1 = require("../middlewares/authorization");
router
    .route("/product-images")
    .post(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), uploadController_1.uploadProductImages);
exports.default = router;
