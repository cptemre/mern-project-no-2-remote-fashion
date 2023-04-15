"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ERROR
const errors_1 = require("../../errors");
const verifyToken = (token) => {
    const isVerified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (typeof isVerified === "string")
        throw new errors_1.UnauthorizedError("access denied");
    return isVerified;
};
exports.default = verifyToken;
