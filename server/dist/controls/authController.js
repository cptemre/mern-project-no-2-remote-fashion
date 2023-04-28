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
exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.registerUser = void 0;
// MODEL
const models_1 = require("../models");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
// BCRYPTJS
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ERRORS
const errors_1 = require("../errors");
// JWT AND CRYPTO
const token_1 = require("../utilities/token");
// SPLIT CARD INFO
const controllers_1 = require("../utilities/controllers");
// * CREATE A NEW USER
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // BODY REQUESTS
    const { name, surname, email, password, phoneNumber, address, card, avatar, } = req.body;
    // CHECK IF INFORMATION IS NOT MISSING CREDENTIALS
    if (!name && !surname && !email && !password)
        throw new errors_1.BadRequestError("name, surname, email and password required");
    let userType = "";
    // CHECK IF USER EXISTS
    const user = yield models_1.User.findOne({ email });
    // THROW ERROR IF USER EXISTS
    if (user)
        throw new errors_1.ConflictError("user already exists");
    // IF THERE ARE NO USERS, FIRST ACCOUNT WILL BE AN ADMIN
    const isUsers = yield models_1.User.find({}).countDocuments();
    // THERE CAN ONLY BE ONE ADMIN
    if (!isUsers)
        userType = "admin";
    else {
        if (userType === "admin")
            throw new errors_1.BadRequestError("admin already exists");
        else
            userType = "user";
    }
    const verificationToken = (0, token_1.createCrypto)();
    // CARD INFO BODY KEY AND VALUE SPLIT
    let cardInfo = {};
    if (card)
        cardInfo = (0, controllers_1.cardInfoSplitter)({ card });
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
            cardInfo,
            avatar,
            verificationToken,
        });
        // await registerEmail(<RegisterVerificationInterface>{
        //   userEmail: user.email,
        //   userName: user.name,
        //   verificationToken: user.verificationToken,
        // });
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ msg: "user created", verificationToken });
        // ! DELETE TOKEN FROM RES LATER
    }
    else
        throw new errors_1.UnauthorizedError("invalid credentials");
});
exports.registerUser = registerUser;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // GET TOKEN AND EMAIL FROM THE CLIENT
        const { verificationToken, email, } = req.body;
        // CHECK IF INFORMATION IS NOT MISSING EMAIL AND PASSWORD
        if (!verificationToken || !email)
            throw new errors_1.BadRequestError("verificationToken and email required");
        // CHECK IF USER EXISTS IN OUR DB
        const user = yield models_1.User.findOne({ email });
        if (!user)
            throw new errors_1.UnauthorizedError("invalid credentials");
        // CHECK IF USER'S DB VERIFICATION TOKEN MATCHES WITH THE PROVIDED CLIENT VALUE
        if (user.verificationToken !== verificationToken)
            throw new errors_1.UnauthorizedError("invalid credentials");
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
    // CHECK IF INFORMATION IS NOT MISSING EMAIL AND PASSWORD
    if (!email || !password)
        throw new errors_1.BadRequestError("email and password required");
    // FIND THE USER
    const user = yield models_1.User.findOne({ email });
    // CHECK IF USER EXISTS
    if (!user)
        throw new errors_1.UnauthorizedError("invalid credentials");
    // COMPARE PASSWORDS
    const isPassword = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPassword)
        throw new errors_1.UnauthorizedError("invalid credentials");
    // IF USER IS VERIFIED
    if (!user.isVerified)
        throw new errors_1.UnauthorizedError("invalid credentials");
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    // CHECK IF USER HAS A VALID TOKEN
    const existingToken = yield models_1.Token.findOne({ user: user._id });
    // DELETE PASSWORD KEY TO NOT ATTACH IT TO TOKEN
    // * THIS CAN CREATE A PROBLEM. CHECK THIS IN THE FUTURE
    // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    if (existingToken) {
        if (!existingToken.isValid)
            throw new errors_1.UnauthorizedError("invalid credentials");
        const refreshToken = existingToken.refreshToken;
        (0, token_1.attachJwtToCookie)({ res, user, refreshToken, ip, userAgent });
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "login success" });
        return;
    }
    // IF NOT CREATE NEW TOKENS
    // GET BROWSER AND IP INFORMATION
    // HASH ALL INFORMATION BEFORE STORING THEM TO DB
    const refreshToken = (0, token_1.createCrypto)();
    const hashedRefreshToken = yield (0, token_1.createHash)(refreshToken);
    if (typeof userAgent !== "string")
        throw new errors_1.UnauthorizedError("user agent is required");
    yield models_1.Token.create({
        refreshToken: hashedRefreshToken,
        ip,
        userAgent,
        user: user._id,
    });
    (0, token_1.attachJwtToCookie)({
        res,
        user,
        refreshToken: hashedRefreshToken,
        ip,
        userAgent,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "login success" });
});
exports.login = login;
// ! DELETE TOKEN
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ! await Token.findOneAndDelete({user:req.user.userId})
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
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET EMAIL ADDRESS FROM CLIENT
    const { email } = req.body;
    // CHECK IF INFORMATION IS NOT MISSING EMAIL
    if (!email)
        throw new errors_1.BadRequestError("email required");
    // FIND THE USER IN DB
    const user = yield models_1.User.findOne({ email });
    if (!user)
        throw new errors_1.UnauthorizedError("invalid credentials");
    // CREATE A TOKEN FOR THE CLIENT
    const passwordToken = (0, token_1.createCrypto)();
    // SEND THE EMAIL TO THE USER
    // await forgotPasswordEmail({
    //   userEmail: email,
    //   userName: user.name,
    //   verificationToken: passwordToken,
    // });
    // CREATE HASHED PASSWORD AND EXP DATE FOR 15 MINUTES
    const quarterHour = 1000 * 60 * 15;
    const hashedPasswordToken = yield (0, token_1.createHash)(passwordToken);
    const passwordTokenExpDate = new Date(Date.now() + quarterHour);
    // SAVE THE USER WITH HASHED TOKEN AND EXP DATE
    user.passwordToken = hashedPasswordToken;
    user.passwordTokenExpDate = passwordTokenExpDate;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "reset email sent", passwordToken });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET INFORMATION FROM CLIENT
    const { passwordToken, email, password } = req.body;
    // CHECK IF INFORMATION IS NOT MISSING ANYTHING
    if (!passwordToken || !email || !password)
        throw new errors_1.BadRequestError("passwordToken, email and password required");
    // CHECK IF USER EXISTS
    const user = yield models_1.User.findOne({ email });
    if (!user)
        throw new errors_1.UnauthorizedError("invalid credentials");
    // COMPARE TOKEN VALIDATION
    const currentDate = new Date(Date.now());
    // COMPARE HASHED USER TOKEN AND REQUEST TOKEN AND EXP DATE
    const isPasswordToken = yield bcryptjs_1.default.compare(passwordToken, user.passwordToken);
    if (isPasswordToken || user.passwordTokenExpDate > currentDate) {
        user.password = password;
        user.passwordToken = "";
        user.passwordTokenExpDate = currentDate;
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "reset success" });
    }
    else
        throw new errors_1.UnauthorizedError("invalid credentials");
});
exports.resetPassword = resetPassword;
