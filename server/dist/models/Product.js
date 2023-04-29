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
const mongoose_1 = require("mongoose");
// ALL SUB CATEGORIES
const categories_1 = require("../utilities/categories");
// MODELS
const models_1 = require("../models");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "product name is required"],
        minlength: [4, "product name must be at least 4 characters"],
        maxlength: [50, "product name can not be more than 50 characters"],
    },
    brand: {
        type: String,
        required: [true, "product name is required"],
        minlength: [2, "brand name must be at least 2 characters"],
        maxlength: [15, "brand name can not be more than 15 characters"],
    },
    price: {
        type: Number,
        required: [true, "product price is required"],
    },
    tax: {
        type: Number,
        required: [true, "product tax percentage is required"],
    },
    image: [
        {
            type: String,
            required: [true, "product name is required"],
        },
    ],
    description: [
        {
            type: String,
            required: [true, "product description is required"],
        },
    ],
    gender: {
        type: String,
        enum: {
            values: ["M", "F", "B"],
            message: "gender value must be 'M', 'F' or 'B'",
        },
        required: [true, "product gender is required"],
    },
    category: {
        type: String,
        required: [true, "product category is required"],
        enum: {
            values: ["clothes", "shoes"],
            message: "product category must be 'clothes' or 'shoes'",
        },
    },
    subCategory: {
        type: String,
        required: [true, "product sub-category is required"],
        minlength: [3, "product sub-category must be at least 3 characters"],
        maxlength: [
            25,
            "product sub-category can not be more than 25 characters",
        ],
        enum: {
            values: categories_1.allSubCategories,
            message: "product sub-category does not match with an expected value",
        },
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
ProductSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = doc._id;
        // FIND ALL REVIEWS WITH THE PRODUCT ID MATCH
        const reviews = yield models_1.Review.find({ product: productId });
        // FIND AND DELETE EVERY DOCUMENT FROM REVIEWS ARRAY WITH A LOOP
        for (let i = 0; i < reviews.length; i++) {
            yield models_1.Review.findOneAndDelete({ _id: reviews[i]._id });
        }
        // FIND ALL USERS WHOSE cartItems ARRAY CONTAINS AN ITEM WITH THE SPECIFIED _id, AND REMOVE THAT ITEM FROM THE ARRAY.
        yield models_1.User.updateMany({ "cartItems._id": productId }, { $pull: { cartItems: { _id: productId } } });
    });
});
const Product = (0, mongoose_1.model)("Product", ProductSchema);
exports.default = Product;
