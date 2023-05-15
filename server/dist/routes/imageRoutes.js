"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const imageController_1 = require("../controllers/imageController");
const authorization_1 = require("../middlewares/authorization");
router
    .route("/:id")
    .patch(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), imageController_1.getSignedUrls)
    .delete(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), imageController_1.deleteImage);
router
    .route("/:type")
    .post(authorization_1.authUser, (0, authorization_1.authRole)("admin", "seller"), imageController_1.uploadImages);
exports.default = router;
