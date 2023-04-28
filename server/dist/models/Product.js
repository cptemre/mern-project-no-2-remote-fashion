"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// ALL SUB CATEGORIES
const categories_1 = require("../utilities/categories");
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
const Product = (0, mongoose_1.model)("Product", ProductSchema);
exports.default = Product;
