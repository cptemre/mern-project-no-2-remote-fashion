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
exports.updateReview = exports.deleteReview = exports.createReview = exports.getSingleReview = exports.getAllReviews = void 0;
// UTILITY FUNCTIONS
const controllers_1 = require("../utilities/controllers");
// MODELS
const models_1 = require("../models");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // REVIEW KEYS FROM THE CLIENT TO CREATE A NEW REVIEW
    const { title, comment, rating, productId, } = req.body;
    // USER ID
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // FIND THE PRODUCT
    const product = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.Product,
    });
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
    var _b, _c;
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // USER AUTH ID
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    // FIND REVIEW FROM DB
    const review = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: reviewId,
        user: userId,
        MyModel: models_1.Review,
    });
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: review.user.toString(),
        });
    // DELETE REVIEW
    yield models_1.Review.findOneAndDelete({ _id: reviewId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review deleted" });
});
exports.deleteReview = deleteReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // GET UPDATE VALUES FROM CLIENT BODY
    const { title, comment, rating, } = req.body;
    // USER AUTH ID
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
    // FIND THE REVIEW
    const review = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: reviewId,
        user: userId,
        MyModel: models_1.Review,
    });
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if ((_e = req.user) === null || _e === void 0 ? void 0 : _e._id)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: review.user.toString(),
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review updated", review });
});
exports.updateReview = updateReview;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // GET IF YOU REQUIRE YOUR OWN REVIEWS
    const { myReview } = req.body;
    // USER AUTH ID
    const userId = myReview === "true" ? (_f = req.user) === null || _f === void 0 ? void 0 : _f._id : null;
    // GET THE REVIEW
    const review = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: reviewId,
        user: userId,
        MyModel: models_1.Review,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review fetched", review });
});
exports.getSingleReview = getSingleReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    // GET PRODUCT ID
    const { productId } = req.body;
    // GET REVIEW PAGE
    const { reviewPage, myReviews } = req.body;
    // USER AUTH ID
    const userId = myReviews === "true" ? (_g = req.user) === null || _g === void 0 ? void 0 : _g._id : null;
    // FIND THE REVIEW
    const product = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        user: userId,
        MyModel: models_1.Product,
    });
    // FIND THE REVIEWS BY PRODUCT ID AND USER ID IF REQUIRED
    const query = { product: "" };
    query.product = productId;
    if (myReviews === "true")
        query.user = (_h = req.user) === null || _h === void 0 ? void 0 : _h._id;
    // LIMIT AND SKIP VALUES
    const myLimit = 5;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: reviewPage });
    const result = models_1.Review.find(query);
    const reviews = yield result.skip(skip).limit(limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "reviews fetched", product, reviews });
});
exports.getAllReviews = getAllReviews;
