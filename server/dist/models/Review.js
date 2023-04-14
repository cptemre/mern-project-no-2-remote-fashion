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
// MONGOOSE
const mongoose_1 = require("mongoose");
// OTHER MODELS
const Product_1 = __importDefault(require("./Product"));
const errors_1 = require("../errors");
const ReviewSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        minlength: [3, "title must be at least 3 characters"],
        maxlength: [30, "title can not be more than 35 characters"],
    },
    comment: {
        type: String,
        required: [true, "review is required"],
        minlength: [10, "review must be at least 10 characters"],
        maxlength: [1000, "review can not be more than 1000 characters"],
    },
    rating: {
        type: Number,
        required: [true, "rating is required"],
        enum: {
            values: [1, 2, 3, 4, 5],
            message: "rating must be one of these values: 1,2,3,4,5",
        },
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "user id is required"],
        ref: "User",
    },
    product: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "product id is required"],
        ref: "Product",
    },
}, { timestamps: true });
// ENSURE THAT ONLY ONE REVIEW PER PRODUCT
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.statics.calculateAverageRating = function (productId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield this.aggregate([
                {
                    $match: { product: productId },
                },
                {
                    $group: {
                        _id: null,
                        averageRating: {
                            $avg: "$rating",
                        },
                        numberOfReviews: {
                            $sum: 1,
                        },
                    },
                },
            ]);
            console.log(result);
            const findAndUpdateQuery = {
                averageRating: Number((_a = result[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0,
                numberOfReviews: Number((_b = result[0]) === null || _b === void 0 ? void 0 : _b.numberOfReviews) || 0,
            };
            const product = yield Product_1.default.findById(productId);
            if (!product) {
                // handle error if product not found
                throw new Error("a");
            }
            product.averageRating = findAndUpdateQuery.averageRating;
            product.numberOfReviews = findAndUpdateQuery.numberOfReviews;
            yield product.save();
        }
        catch (error) {
            throw new errors_1.BadRequestError("average rate for product can not be calculated");
        }
    });
};
ReviewSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield Review.calculateAverageRating(this.product);
    });
});
ReviewSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Review.calculateAverageRating(doc.product);
    });
});
const Review = (0, mongoose_1.model)("Review", ReviewSchema);
exports.default = Review;
