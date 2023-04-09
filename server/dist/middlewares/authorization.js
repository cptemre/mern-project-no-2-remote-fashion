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
exports.authUser = void 0;
// JWT
const token_1 = require("../utilities/token");
// ERRORS
const errors_1 = require("../errors");
// MODELS
const models_1 = require("../models");
// BCRYPTJS
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { access_token, refresh_token, } = req.signedCookies;
        if (access_token) {
            const isVerified = (0, token_1.verifyToken)(access_token);
            req.user = isVerified.user;
            next();
            return;
        }
        if (refresh_token) {
            const isVerified = (0, token_1.verifyToken)(refresh_token);
            const existingToken = yield models_1.Token.findOne({
                user: isVerified.user._id,
            });
            const ip = req.ip;
            const userAgent = req.headers["user-agent"];
            if (!existingToken ||
                !existingToken.isValid
            // isVerified.ip !== ip
            // // isVerified.userAgent !== userAgent
            )
                throw new errors_1.UnauthorizedError("access denied");
            const isTokenCorrect = yield bcryptjs_1.default.compare(isVerified.refreshToken, existingToken === null || existingToken === void 0 ? void 0 : existingToken.refreshToken);
            if (!isTokenCorrect)
                throw new errors_1.UnauthorizedError("access denied");
            (0, token_1.attachJwtToCookie)({
                res,
                user: isVerified.user,
                refreshToken: refresh_token,
                ip,
                userAgent,
            });
            req.user = isVerified.user;
            next();
        }
        else {
            throw new errors_1.UnauthorizedError("access denied");
        }
    }
    catch (error) {
        console.log(error);
        throw new errors_1.UnauthorizedError("access denied");
    }
});
exports.authUser = authUser;
