"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categories_1 = require("../utilities/categories");
const ImageSchema = new mongoose_1.Schema({
    originalName: {
        type: String,
        required: [true, "original image name is required"],
        minlength: [1, "original image name must be at least 1 character"],
        maxlength: [200, "original image name can not be more than 200 characters"],
    },
    cryptoName: {
        type: String,
        required: [true, "crypto image name is required"],
    },
    mimeType: {
        type: String,
        required: [true, "image type is required"],
        maxlength: [10, "image type can not be more than 10 characters"],
    },
    size: {
        type: Number,
        required: [true, "image size is required"],
        min: [80000, "image size must be at least 80kb"],
        max: [500000, "image size can not be more than 500kb"],
    },
    url: String,
    type: {
        type: String,
        enum: {
            values: categories_1.imageUploadTypes,
            message: `image type must be one of the following: ${categories_1.imageUploadTypes}`,
        },
    },
});
const Image = (0, mongoose_1.model)("Image", ImageSchema);
exports.default = Image;
