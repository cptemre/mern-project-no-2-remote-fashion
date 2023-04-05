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
exports.registerUser = void 0;
// MODEL
const User_1 = __importDefault(require("../models/User"));
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
// CRYPTO
const crypto_1 = __importDefault(require("crypto"));
// ERRORS
const errors_1 = require("../errors");
// * CREATE A NEW USER
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // BODY REQUESTS
    const { name, surname, email, password, phoneNumber, address, cardNumber, avatar, } = req.body;
    let { userType } = { userType: "" };
    // CHECK IF USER EXISTS
    const user = yield User_1.default.findOne({ email });
    // THROW ERROR IF USER EXISTS
    if (user) {
        throw new errors_1.ConflictError("user already exists");
    }
    // IF THERE ARE NO USERS, FIRST ACCOUNT WILL BE AN ADMIN
    const isUsers = yield User_1.default.find({}).countDocuments();
    // THERE CAN ONLY BE ONE ADMIN
    if (!isUsers)
        userType = "admin";
    else {
        if (userType === "admin")
            throw new Error("Error");
        else
            userType = req.body;
    }
    const verificationToken = crypto_1.default.randomBytes(40).toString("hex");
    // CREATE USER IF REQUIRED CREDENTIALS EXIST
    if (name && surname && email && password && userType) {
        yield User_1.default.create({
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
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "user created" });
    }
    else
        throw new errors_1.UnauthorizedError("missing credentials");
});
exports.registerUser = registerUser;
