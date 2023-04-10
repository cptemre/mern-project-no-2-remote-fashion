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
// UTILITY FUNCTIONS
const findDocumentByIdAndModel_1 = __importDefault(require("../utilities/controllers/findDocumentByIdAndModel"));
// MODELS
const models_1 = require("../models");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET PRODUCT ID
    const { id: productId } = req.params;
    // REVIEW KEYS FROM THE CLIENT TO CREATE A NEW REVIEW
    const { title, comment, rating, } = req.body;
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
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET REVIEW ID
    const { id: reviewId } = req.params;
    // FIND REVIEW FROM DB
    const review = yield (0, findDocumentByIdAndModel_1.default)({
        id: reviewId,
        MyModel: models_1.Review,
    });
    // DELETE REVIEW
    yield review.deleteOne();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "review deleted" });
});
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID
    const { id: productId } = req.params;
    // GET REVIEW PAGE
    const { reviewPage } = req.body;
    // FIND THE PRODUCT
    const product = yield (0, findDocumentByIdAndModel_1.default)({
        id: productId,
        MyModel: models_1.Product,
    });
    // FIND THE REVIEWS BY PRODUCT ID
    // SKIP NECESSARY PART AND LIMIT IT TO 10
    const limit = 10;
    const skip = limit * reviewPage ? reviewPage - 1 : 1;
    const reviews = yield models_1.Review.find({ product: productId })
        .skip(skip)
        .limit(limit);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "reviews recieved", product, reviews });
});
