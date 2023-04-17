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
// MODELS
const models_1 = require("../models");
// STATUS CODES
const http_status_codes_1 = require("http-status-codes");
// FIND DOCUMENT
const controllers_1 = require("../utilities/controllers");
// ERRORS
const errors_1 = require("../errors");
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
    const result = models_1.User.find({ query });
    // SET LIMIT AND SKIP
    const limit = 10;
    const skip = 10 * (userPage || 0);
    const users = yield result.skip(skip).limit(10);
    // SEND BACK FETCHED USERS
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "users fetched", users });
});
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // GET THE USER FROM DB
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        MyModel: models_1.User,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user fetched", user });
});
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "current user fetched", user: req.user });
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // CHECK IF THE USER HAS PERMISSION TO GET THE USER.
    // HAS TO BE SAME USER OR AN ADMIN TO DO THAT
    // ! USE THIS FUNCTION IN OTHER CONTROLLERS TO CHECK PROPER USER ID MATCH
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({ user: req.user, userId });
    // CHECK IF THE USER EXISTS
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        MyModel: models_1.User,
    });
    // DELETE THE USER
    yield models_1.User.findOneAndDelete({ _id: userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user deleted", user });
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // GET UPDATED VALUES FROM THE CLIENT
    const { name, surname, email, userType, street, city, postalCode, country, countryCode, phoneNo, cardNumber, avatar, } = req.body;
    // CHECK IF THE USER HAS PERMISSION TO GET THE USER.
    // HAS TO BE SAME USER OR AN ADMIN TO DO THAT
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.userType) !== "admin" && userId !== ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id))
        throw new errors_1.UnauthorizedError("authorization failed");
    // CHECK IF THE USER EXISTS
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        user: userId,
        MyModel: models_1.User,
    });
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
    if (street && city && postalCode && country)
        user.address = {
            street,
            city,
            postalCode,
            country,
        };
    // PHONE NUMBER UPDATE
    if (countryCode && phoneNo)
        user.phoneNumber = {
            countryCode,
            phoneNo,
        };
    // REST OF THE OPTIONAL KEY UPDATES
    if (cardNumber)
        user.cardNumber = cardNumber;
    if (avatar)
        user.avatar = avatar;
});
