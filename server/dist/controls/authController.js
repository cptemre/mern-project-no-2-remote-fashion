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
exports.login = exports.verifyEmail = exports.registerUser = void 0;
// MODEL
const models_1 = require("../models");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
// CRYPTO
const crypto_1 = __importDefault(require("crypto"));
// BCRYPTJS
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ERRORS
const errors_1 = require("../errors");
// SEND EMAIL
const email_1 = require("../utilities/email");
const attachJwtToCookie_1 = __importDefault(require("../utilities/token/attachJwtToCookie"));
// * CREATE A NEW USER
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // BODY REQUESTS
    const { name, surname, email, password, phoneNumber, address, cardNumber, avatar, } = req.body;
    let userType = "";
    // CHECK IF USER EXISTS
    const user = yield models_1.User.findOne({ email });
    // THROW ERROR IF USER EXISTS
    if (user) {
        throw new errors_1.ConflictError("user already exists");
    }
    // IF THERE ARE NO USERS, FIRST ACCOUNT WILL BE AN ADMIN
    const isUsers = yield models_1.User.find({}).countDocuments();
    // THERE CAN ONLY BE ONE ADMIN
    if (!isUsers)
        userType = "admin";
    else {
        if (userType === "admin")
            throw new errors_1.UnauthorizedError("Error");
        else
            userType = req.body;
    }
    const verificationToken = crypto_1.default.randomBytes(40).toString("hex");
    // CREATE USER IF REQUIRED CREDENTIALS EXIST
    if (name && surname && email && password && userType) {
        const user = yield models_1.User.create({
            name,
            surname,
            email,
            password,
            userType,
            phoneNumber,
            address,
            cardNumber,
            avatar,
            verificationToken,
        });
        yield (0, email_1.registerEmail)({
            userEmail: user.email,
            userName: user.name,
            verificationToken: user.verificationToken,
        });
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ msg: "user created", verificationToken });
        // ! DELETE TOKEN FROM RES LATER
    }
    else
        throw new errors_1.UnauthorizedError("missing or invalid credentials");
});
exports.registerUser = registerUser;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // GET TOKEN AND EMAIL FROM THE CLIENT
        const { verificationToken, email, } = req.body;
        // CHECK IF USER EXISTS IN OUR DB
        const user = yield models_1.User.findOne({ email });
        if (!user)
            throw new errors_1.UnauthorizedError("missing or invalid credentials");
        // CHECK IF USER'S DB VERIFICATION TOKEN MATCHES WITH THE PROVIDED CLIENT VALUE
        if (user.verificationToken !== verificationToken)
            throw new errors_1.UnauthorizedError("missing or invalid credentials");
        // UPDATE USER AND SAVE
        user.verificationToken = "";
        user.isVerified = true;
        user.verified = new Date(Date.now());
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user verified" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET EMAIL AND PASSWORD VALUES FROM THE CLIENT
    const { email, password } = req.body;
    // FIND THE USER
    const user = yield models_1.User.findOne({ email });
    // CHECK IF USER EXISTS
    if (!user)
        throw new errors_1.UnauthorizedError("missing or invalid credentials");
    // COMPARE PASSWORDS
    const isPassword = bcryptjs_1.default.compare(password, user.password);
    if (!isPassword)
        throw new errors_1.UnauthorizedError("missing or invalid credentials");
    // IF USER IS VERIFIED
    if (!user.isVerified)
        throw new errors_1.UnauthorizedError("missing or invalid credentials");
    // CHECK IF USER HAS A VALID TOKEN
    const existingToken = yield models_1.Token.findOne({ user: user._id });
    if (existingToken) {
        if (!existingToken.isValid)
            throw new errors_1.UnauthorizedError("missing or invalid credentials");
        const refreshToken = existingToken.refreshToken;
        (0, attachJwtToCookie_1.default)({ res, user, refreshToken });
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "login success" });
    }
    // IF NOT CREATE NEW TOKENS
    const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    yield models_1.Token.create({ refreshToken, ip, userAgent, user: user._id });
    (0, attachJwtToCookie_1.default)({ res, user, refreshToken });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "login success" });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await Token.findOneAndDelete({user:req.user.userId})
    res.cookie("access_token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie("refresh_token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "logout success" });
});
