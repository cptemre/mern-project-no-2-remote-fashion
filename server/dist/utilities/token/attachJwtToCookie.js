"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = ({ payload }) => {
    const jwtSecret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret);
    return token;
};
const attachJwtToCookie = ({ res, user, refreshToken }) => {
    const payload = { user, refreshToken };
    const status = process.env.STATUS;
    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30;
    const access_token = createJWT({ payload });
    const refresh_token = createJWT({ payload });
    res.cookie(access_token, "access_token", {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        signed: true,
        secure: status === "production",
    });
    res.cookie(refresh_token, "refresh_token", {
        httpOnly: true,
        expires: new Date(Date.now() + oneMonth),
        signed: true,
        secure: status === "production",
    });
};
exports.default = attachJwtToCookie;
