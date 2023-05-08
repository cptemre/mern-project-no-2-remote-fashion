"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.deleteReview = exports.createReview = exports.getSingleReview = exports.getMyAllReviews = exports.getAllReviews = void 0;
// UTILITY FUNCTIONS
const controllers_1 = require("../utilities/controllers");
// MODELS
const models_1 = require("../models");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // REVIEW KEYS FROM THE CLIENT TO CREATE A NEW REVIEW
    const { title, comment, rating, productId, } = req.body;
    // USER ID
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // FIND THE PRODUCT
    const product = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.Product,
    });
    // CHECK IF THE USER ORDERED THIS PRODUCT BEFORE
    const singleOrder = yield models_1.SingleOrder.findOne({
        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        product: productId,
    });
    if (!singleOrder)
        throw new errors_1.UnauthorizedError("you did not purchase this item");
    // CREATE THE REVIEW
    const review = yield models_1.Review.create({
        title,
        comment,
        rating,
        user: userId,
        product: productId,
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "review created", product, review });
});
exports.createReview = createReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // USER AUTH ID
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization failed");
    const { userType, _id: reqUserId } = req.user;
    // FIND REVIEW FROM DB
    const review = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: reviewId,
        user: reqUserId.toString(),
        MyModel: models_1.Review,
    });
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({
        userType,
        userId: review.user,
        reqUserId,
    });
    // DELETE REVIEW
    yield models_1.Review.findOneAndDelete({ _id: reviewId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review deleted" });
});
exports.deleteReview = deleteReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // GET UPDATE VALUES FROM CLIENT BODY
    const { title, comment, rating, } = req.body;
    // USER AUTH ID
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization failed");
    const { userType, _id: reqUserId } = req.user;
    // FIND THE REVIEW
    const review = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: reviewId,
        user: reqUserId.toString(),
        MyModel: models_1.Review,
    });
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({
        userType,
        userId: review.user,
        reqUserId,
    });
    // UPDATE THE REVIEW DOCUMENT
    if (title)
        review.title = title;
    if (comment)
        review.comment = comment;
    if (rating)
        review.rating = rating;
    // SAVE THE REVIEW AFTER UPDATE
    yield review.save();
    // SEND RES
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review updated", result: review });
});
exports.updateReview = updateReview;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // GET THE REVIEW
    const result = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: reviewId,
        MyModel: models_1.Review,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review fetched", result });
});
exports.getSingleReview = getSingleReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET REVIEW PAGE
    const { reviewPage, product: productId, } = req.body;
    return (0, controllers_1.getAllReviewsController)({ reviewPage, productId, res });
});
exports.getAllReviews = getAllReviews;
const getMyAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // GET REVIEW PAGE
    const { reviewPage, product: productId, } = req.body;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString();
    return (0, controllers_1.getAllReviewsController)({ userId, reviewPage, productId, res });
});
exports.getMyAllReviews = getMyAllReviews;
