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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.deleteReview = exports.createReview = exports.getSingleReview = exports.getAllReviews = void 0;
// UTILITY FUNCTIONS
const findDocumentByIdAndModel_1 = __importDefault(require("../utilities/controllers/findDocumentByIdAndModel"));
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
    const product = yield (0, findDocumentByIdAndModel_1.default)({
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
    var _b;
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // USER AUTH ID
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    // FIND REVIEW FROM DB
    const review = yield (0, findDocumentByIdAndModel_1.default)({
        id: reviewId,
        user: userId,
        MyModel: models_1.Review,
    });
    // DELETE REVIEW
    yield models_1.Review.findOneAndDelete({ _id: reviewId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review deleted" });
});
exports.deleteReview = deleteReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // GET UPDATE VALUES FROM CLIENT BODY
    const { title, comment, rating, } = req.body;
    // USER AUTH ID
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    // FIND THE REVIEW
    const review = yield (0, findDocumentByIdAndModel_1.default)({
        id: reviewId,
        user: userId,
        MyModel: models_1.Review,
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
    var _d;
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // GET IF YOU REQUIRE YOUR OWN REVIEWS
    const { myReview } = req.body;
    // USER AUTH ID
    const userId = myReview === "true" ? (_d = req.user) === null || _d === void 0 ? void 0 : _d._id : null;
    // GET THE REVIEW
    const review = yield (0, findDocumentByIdAndModel_1.default)({
        id: reviewId,
        user: userId,
        MyModel: models_1.Review,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review fetched", review });
});
exports.getSingleReview = getSingleReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // GET PRODUCT ID
    const { productId } = req.body;
    // GET REVIEW PAGE
    const { reviewPage, myReviews } = req.body;
    // USER AUTH ID
    const userId = myReviews === "true" ? (_e = req.user) === null || _e === void 0 ? void 0 : _e._id : null;
    // FIND THE REVIEW
    const product = yield (0, findDocumentByIdAndModel_1.default)({
        id: productId,
        user: userId,
        MyModel: models_1.Product,
    });
    // FIND THE REVIEWS BY PRODUCT ID AND USER ID IF REQUIRED
    const query = { product: "" };
    query.product = productId;
    if (myReviews === "true")
        query.user = (_f = req.user) === null || _f === void 0 ? void 0 : _f._id;
    // SKIP NECESSARY PART AND LIMIT IT TO 10
    const limit = 10;
    const skip = limit * reviewPage ? reviewPage - 1 : 0;
    const result = models_1.Review.find(query);
    const reviews = yield result.skip(skip).limit(limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "reviews fetched", product, reviews });
});
exports.getAllReviews = getAllReviews;
