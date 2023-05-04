"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const reviewController_1 = require("../controls/reviewController");
const authorization_1 = require("../middlewares/authorization");
router
    .route("/")
    .get(reviewController_1.getAllReviews)
    .post(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), reviewController_1.createReview);
router
    .route("/my-reviews")
    .get(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), reviewController_1.getMyAllReviews);
router
    .route("/:id")
    .get(reviewController_1.getSingleReview)
    .delete(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), reviewController_1.deleteReview)
    .patch(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), reviewController_1.updateReview);
exports.default = router;
