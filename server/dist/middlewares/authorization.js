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
exports.authRole = exports.authUser = void 0;
// JWT
const token_1 = require("../utilities/token");
// ERRORS
const errors_1 = require("../errors");
// MODELS
const models_1 = require("../models");
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // GET TOKENS
        const { access_token, refresh_token, } = req.signedCookies;
        // IF ACCESS TOKEN THEN VERIFY IT AND ASSIGN TO REQ.USER
        if (access_token) {
            const isVerified = (0, token_1.verifyToken)(access_token);
            req.user = isVerified.user;
            next();
            return;
        }
        // IF ONLY REFRESH TOKEN
        if (refresh_token) {
            // VERIFY IT
            const isVerified = (0, token_1.verifyToken)(refresh_token);
            // GET EXISTING TOKEN FROM DB
            const existingToken = yield models_1.Token.findOne({
                user: isVerified.user._id,
            });
            // GET USER IP AND AGENT INFO
            const ip = req.ip;
            const userAgent = req.headers["user-agent"];
            // COMPARE EXISTING TOKEN, IP AND AGENT
            if (!existingToken ||
                !existingToken.isValid ||
                isVerified.ip !== ip ||
                isVerified.userAgent !== userAgent)
                throw new errors_1.UnauthorizedError("authorization failed");
            // CHECK IF VERIFY REFRESH TOKEN IS EQUAL TO EXISTING TOKEN
            if (isVerified.refreshToken !== (existingToken === null || existingToken === void 0 ? void 0 : existingToken.refreshToken))
                throw new errors_1.UnauthorizedError("authorization failed");
            (0, token_1.attachJwtToCookie)({
                res,
                user: isVerified.user,
                refreshToken: isVerified.refreshToken,
                ip,
                userAgent,
            });
            req.user = isVerified.user;
            next();
        }
        else {
            throw new errors_1.UnauthorizedError("authorization failed");
        }
    }
    catch (error) {
        throw new errors_1.UnauthorizedError("authorization failed");
    }
});
exports.authUser = authUser;
// CHECK IF THE PROVIDED ROLE FITS WITH THE REQ.USER TO ALLOW NEXT MIDDLEWARE
const authRole = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!req.user || !req.user.userType || !roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.userType))
            throw new errors_1.UnauthorizedError("access denied");
        // ELSE NEXT
        next();
    };
};
exports.authRole = authRole;
