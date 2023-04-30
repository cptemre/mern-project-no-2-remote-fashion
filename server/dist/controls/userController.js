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
exports.updateUser = exports.deleteUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
// MODELS
const models_1 = require("../models");
// STATUS CODES
const http_status_codes_1 = require("http-status-codes");
// FIND DOCUMENT
const controllers_1 = require("../utilities/controllers");
// CRYPTO
const token_1 = require("../utilities/token");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // BODY FROM THE CLIENT
    const { name, surname, email, userType, country, isVerified, userPage, } = req.body;
    // QUERY OBJECT TO FIND NEEDED USERS
    const query = {};
    // SET QUERY KEYS
    if (name)
        query.name = name;
    if (surname)
        query.surname = surname;
    if (email)
        query.email = email;
    if (userType)
        query.userType = userType;
    if (country)
        query.country = country;
    if (isVerified)
        query.isVerified = isVerified;
    // GET USERS
    const result = models_1.User.find({ query }).select("-password");
    // LIMIT AND SKIP VALUES
    const myLimit = 20;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: userPage });
    const users = yield result.skip(skip).limit(limit);
    // SEND BACK FETCHED USERS
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "users fetched", users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // GET THE USER FROM DB
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        MyModel: models_1.User,
    });
    // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user fetched", user });
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "current user fetched", user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // CHECK IF THE USER HAS PERMISSION TO GET THE USER.
    // HAS TO BE SAME USER OR AN ADMIN TO DO THAT
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({ user: req.user, userId });
    // CHECK IF THE USER EXISTS
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        MyModel: models_1.User,
    });
    // SET THE USER PASSWORD TO EMPTY BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    // DELETE THE USER
    yield models_1.User.findOneAndDelete({ _id: userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user deleted", user });
});
exports.deleteUser = deleteUser;
// ! BEFORE UPDATE CLIENT SHOULD ASK FOR PASSWORD CHECK
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // GET UPDATED VALUES FROM THE CLIENT
    const { name, surname, email, userType, street, city, postalCode, country, countryCode, phoneNo, state, 
    // ! CHANGE THIS TO OBJECT
    card, avatar, cartItems, } = req.body;
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({ user: req.user, userId });
    // CHECK IF THE USER EXISTS
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        user: userId,
        MyModel: models_1.User,
    });
    // SAVE THE OLD EMAIL TO COMPARE IF CHANGED
    let oldEmail = user.email;
    let isEmailChanged = false;
    // MAIN INFO UPDATE
    if (name)
        user.name = name;
    if (surname)
        user.surname = surname;
    if (email)
        user.email = email;
    if (userType)
        user.userType = userType;
    // ADDRESS OBJECT UPDATE
    if (street && city && postalCode && country && state)
        user.address = {
            street,
            city,
            postalCode,
            country,
            state,
        };
    // PHONE NUMBER UPDATE
    if (countryCode && phoneNo)
        user.phoneNumber = {
            countryCode,
            phoneNo,
        };
    // REST OF THE OPTIONAL KEY UPDATES
    // CARD INFO BODY KEY AND VALUE SPLIT
    if (card) {
        let cardInfo = {
            cardNumber: "",
            expMonth: undefined,
            expYear: undefined,
            cvc: "",
        };
        cardInfo = (0, controllers_1.cardInfoSplitter)({ card });
        user.cardInfo = cardInfo;
    }
    if (avatar)
        user.avatar = avatar;
    // IF EMAIL DID NOT CHANGE THEN SEND THE RESPONSE
    if (oldEmail !== user.email) {
        isEmailChanged = true;
        // RESET THE VERIFICATION
        user.verificationToken = (0, token_1.createCrypto)();
        user.verified = undefined;
        user.isVerified = false;
        // ! CLIENT SHOULD CALL LOGOUT AFTER THIS EVENT
    }
    // CART ITEMS UPDATE
    // ! CONTINUE FROM HERE
    if (cartItems)
        user.cartItems = cartItems;
    // SAVE THE USER
    yield user.save();
    // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "user updated", user, isEmailChanged });
});
exports.updateUser = updateUser;
