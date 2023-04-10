"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// MONGOOSE
const mongoose_1 = require("mongoose");
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
const Review = (0, mongoose_1.model)("Review", ReviewSchema);
exports.default = Review;
