"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    const customError = {
        msg: err.message || "something went wrong",
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
    };
    // DUPLICATE ERROR HANDLE
    if (err.code === 11000) {
        customError.msg = "product is already in our system";
        customError.statusCode = http_status_codes_1.StatusCodes.CONFLICT;
    }
    // CAST ERROR HANDLE
    if (err.name === "CastError") {
        customError.msg = "product id type is wrong";
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    // VALIDATION ERROR
    if (err.name === "ValidationError") {
        const errorArray = Object.keys(err.errors).map((key) => err.errors[key].message);
        customError.msg = errorArray.toString();
        customError.statusCode = http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY;
    }
    res.status(customError.statusCode).json({ msg: customError.msg });
};
exports.default = errorHandler;
